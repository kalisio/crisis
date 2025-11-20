import _ from 'lodash'
import makeDebug from 'debug'

const debug = makeDebug('crisis:test:utils.client')

export async function createOrganisation (organisation, client) {
	let org
	// First initiate owner account with his organisation if required
	const orgOwner = _.get(organisation, 'owner')
	try {
		await client.getService('users').create(orgOwner)
		await client.createUser(orgOwner)
	} catch (error) {
		console.log(error)
	}
	
	// Ensure we are logged as org owner
	await client.login(orgOwner)
	// Retrieve org
	const response = await client.getService('organisations').find({ query: { _id: orgOwner._id } })
	// If not create it
	if (response.total === 0) {
		org = await client.getService('organisations').create({ name: orgOwner.name, billing: { subscription: { plan: 'diamond' } } })
		debug(`Created organisation ${org.name} - ID ${org._id}`)
	} else {
		org = response.data[0]
		debug(`Retrieved organisation ${org.name} - ID ${org._id}`)
	}
	// Keep track of IDs
	organisation._id = org._id
	organisation.name = org.name
	await client.logout()
}

export async function createMembers (organisation, client) {
	const orgOwner = _.get(organisation, 'owner')
	// Ensure we are logged as org owner first
	await client.login(orgOwner)
	const members = _.get(organisation, 'members', [])
	for (let i = 0; i < members.length; i++) {
		const orgMember = members[i]
		let member
		// Check if member already exists
		const response = await client.getService('users').find({ query: { email: orgMember.email } })
		// If not create it, otherwise add it
		if (response.total === 0) {
			member = await client.getService('users').create(Object.assign({
				sponsor: {
					id: orgOwner._id,
					organisationId: organisation._id,
					roleGranted: orgMember.permissions
				},
				suggestedPassword: orgMember.password
			}, _.pick(orgMember, ['name', 'email'])))
			debug(`Created organisation member ${member.name} - ${member._id} - ${orgMember.permissions}`)
		} else {
			member = response.data[0]
			await client.getService('authorisations').create({
				scope: 'organisations',
				permissions: orgMember.permissions,
				subjects: member._id,
				subjectsService: 'users',
				resource: organisation._id,
				resourcesService: 'organisations'
			})
			debug(`Added organisation member ${member.name} - ID ${member._id} - ${orgMember.permissions}`)
		}
		// Keep track of IDs
		orgMember._id = member._id
	}
	await client.logout()
	// If we'd like to be able to manage guest members we need to login
	for (let i = 0; i < members.length; i++) {
		await client.login(members[i])
		await client.logout()
	}
}

export async function createGroups (organisation, client) {
	const orgOwner = _.get(organisation, 'owner')
	// Ensure we are logged as org owner first
	await client.login(orgOwner)
	const groups = _.get(organisation, 'groups', [])
	for (let i = 0; i < groups.length; i++) {
		const orgGroup = groups[i]
		let group
		// Check if member already exists
		const response = await client.getService('groups', organisation).find({ query: { name: orgGroup.name } })
		// If not existing create it
		if (response.total === 0) {
			group = await client.getService('groups', organisation).create(_.pick(orgGroup, ['name', 'description']))
			debug(`Created organisation group ${group.name} - ID ${group._id}`)
		} else {
			group = response.data[0]
			debug(`Retrieved organisation group ${group.name} - ID ${group._id}`)
		}
		// Keep track of IDs
		orgGroup._id = group._id
	}
	await client.logout()
}

export async function createTags (organisation, client) {
	const orgOwner = _.get(organisation, 'owner')
	// Ensure we are logged as org owner first
	await client.login(orgOwner)
	const tags = _.get(organisation, 'tags', [])
	for (let i = 0; i < tags.length; i++) {
		const orgTag = tags[i]
		let tag
		// Check if member already exists
		const response = await client.getService('tags', organisation).find({ query: { value: orgTag.value } })
		// If not existing create it
		if (response.total === 0) {
			tag = await client.getService('tags', organisation).create(_.pick(orgTag, ['value', 'description']))
			debug(`Created organisation tag ${tag.value} - ID ${tag._id}`)
		} else {
			tag = response.data[0]
			debug(`Retrieved organisation tag ${tag.value} - ID ${tag._id}`)
		}
		// Keep track of IDs
		orgTag._id = tag._id
	}
	await client.logout()
}

// To be called after members/tags creation
export async function tagMembers (organisation, client) {
	const orgOwner = _.get(organisation, 'owner')
	const orgTags = _.get(organisation, 'tags', [])
	// Ensure we are logged as org owner first
	await client.login(orgOwner)
	const members = _.get(organisation, 'members', [])
	for (let i = 0; i < members.length; i++) {
		const orgMember = members[i]
		const tags = _.filter(orgTags, orgTag => {
			return _.find(_.get(orgMember, 'tags', []), memberTag => _.isEqual(memberTag.value, orgTag.value)) !== undefined
		})
		await client.getService('members', organisation).patch(orgMember._id, {
			tags: tags.map(tag => Object.assign({ scope: 'members', context: organisation._id, service: organisation._id + '/tags' }, tag))
		})
	}
	await client.logout()
}

// To be called after members/groups creation
export async function groupMembers (organisation, client) {
	const orgOwner = _.get(organisation, 'owner')
	const orgGroups = _.get(organisation, 'groups', [])
	// Ensure we are logged as org owner first
	await client.login(orgOwner)
	const members = _.get(organisation, 'members', [])
	for (let i = 0; i < members.length; i++) {
		const orgMember = members[i]
		const groups = _.get(orgMember, 'groups', [])
		for (let j = 0; j < groups.length; j++) {
			const group = groups[j]
			const orgGroup = _.find(orgGroups, { name: group.name })
			await client.getService('authorisations').create({
				scope: 'groups',
				permissions: group.permissions,
				subjects: orgMember._id,
				subjectsService: organisation._id + '/members',
				resource: orgGroup._id,
				resourcesService: organisation._id + '/groups'
			})
		}
	}
	await client.logout()
}

export async function removeMembers (organisation, client) {
	const orgOwner = _.get(organisation, 'owner')
	// Ensure we are logged as org owner first
	await client.login(orgOwner)
	const members = _.get(organisation, 'members', [])
	for (let i = 0; i < members.length; i++) {
		const orgMember = members[i]
		try {
			// Try by email if no ID provided
			if (!orgMember._id) {
				const response = await client.getService('members', organisation).find({ query: { email: orgMember.email } })
				if (response.total === 1) {
					orgMember._id = response.data[0]._id
				}
			}
			await client.getService('authorisations').remove(organisation._id, {
				query: {
					scope: 'organisations',
					subjects: orgMember._id,
					subjectsService: organisation._id + '/members',
					resourcesService: 'organisations'
				}
			})
			debug(`Removed member ${orgMember.name} from organisation with ID ${organisation._id}`)
		} catch (error) {
			debug(`Impossible to remove member ${orgMember.name} from organisation with ID ${organisation._id}:`, error.name || error.code || error.message)
		}
	}
	await client.logout()
	// Now remove member accounts
	for (let i = 0; i < members.length; i++) {
		await client.removeUser(members[i])
	}
}

export async function removeOrganisation (organisation, client) {
	const orgOwner = _.get(organisation, 'owner')
	// Remove organisations
	let organisations = []
	await client.login(orgOwner)
	const response = await client.getService('users').find({ query: { email: orgOwner.email } })
	if (response.total === 1) orgOwner._id = response.data[0]._id
	if (response.total === 1 && response.data[0].organisations) organisations = response.data[0].organisations
	for (let i = 0; i < organisations.length; i++) {
		try {
			await client.getService('organisations').remove(organisations[i]._id)
			debug(`Removed organisation ${organisations[i].name} - ID ${organisations[i]._id}`)
		} catch (error) {
			debug(`Error deleting organisation ${organisations[i].name} - ID ${organisations[i]._id}:`, error.name || error.code || error.message)
		}
	}
	// Remove organisation owner
	await client.removeUser(orgOwner)
}

export async function removeGroups (organisation, client) {
	const orgOwner = _.get(organisation, 'owner')
	// Ensure we are logged as org owner first
	await client.login(orgOwner)
	const groups = _.get(organisation, 'groups', [])
	for (let i = 0; i < groups.length; i++) {
		const orgGroup = groups[i]
		try {
			// Try by name if no ID provided
			if (!orgGroup._id) {
				const response = await client.getService('groups', organisation).find({ query: { name: orgGroup.name } })
				if (response.total === 1) {
					orgGroup._id = response.data[0]._id
				}
			}
			await client.getService('groups', organisation).remove(orgGroup._id)
			debug(`Removed group ${orgGroup.name} from organisation with ID ${organisation._id}`)
		} catch (error) {
			debug(`Impossible to remove group ${orgGroup.name} from organisation with ID ${organisation._id}:`, error.name || error.code || error.message)
		}
	}
	await client.logout()
}

export async function removeTags (organisation, client) {
	const orgOwner = _.get(organisation, 'owner')
	// Ensure we are logged as org owner first
	await client.login(orgOwner)
	const tags = _.get(organisation, 'tags', [])
	for (let i = 0; i < tags.length; i++) {
		const orgTag = tags[i]
		try {
			// Try by name if no ID provided
			if (!orgTag._id) {
				const response = await client.getService('tags', organisation).find({ query: { name: orgTag.value } })
				if (response.total === 1) {
					orgTag._id = response.data[0]._id
				}
			}
			await client.getService('tags', organisation).remove(orgTag._id)
			debug(`Removed tag ${orgTag.value} from organisation with ID ${organisation._id}`)
		} catch (error) {
			debug(`Impossible to remove tag ${orgTag.value} from organisation with ID ${organisation._id}:`, error.name || error.code || error.message)
		}
	}
	await client.logout()
}