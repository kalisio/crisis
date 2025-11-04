import _ from 'lodash'
import sift from 'sift'

export function getLocationAsFeature (object) {
  if (!object || !object.location) return null
  const location = object.location
  let feature = location
  // backward compatibility with old format with only a geometry, not a feature
  if (location.type !== 'Feature') {
    feature = { type: 'Feature', geometry: location, properties: { name: location.name } }
    if (!_.has(feature, 'geometry.type')) feature.geometry = { type: 'Point', coordinates: [location.longitude, location.latitude] }
  }
  return feature
}

export function hasRoleInEvent (user, roles) {
  return _.findIndex(roles, role => {
    if ((role.service === 'members') && (role._id === user._id)) return true
    if ((role.service === 'groups') ||
        (role.service === 'tags') ||
        (role.service === 'organisations')) {
      if ([user].find(sift({ [role.service + '._id']: role._id }))) return true
    }
    return false
  }) >= 0
}

export function getEventsQuery (user, contextId) {
  const ids = [user._id]
  if (contextId) {
    _.get(user, 'groups', []).forEach(group => {
      if (group.context === contextId) ids.push(group._id)
    })
    _.get(user, 'tags', []).forEach(tag => {
      if (tag.context === contextId) ids.push(tag._id)
    })
  }
  return {
    $or: [{
      'participants._id': { $in: ids }
    }, {
      'coordinators._id': { $in: ids }
    }]
  }
}

export function getPlansQuery (user, contextId) {
  const ids = [user._id]
  if (contextId) {
    _.get(user, 'groups', []).forEach(group => {
      if (group.context === contextId) ids.push(group._id)
    })
    _.get(user, 'tags', []).forEach(tag => {
      if (tag.context === contextId) ids.push(tag._id)
    })
  }
  return {
    'coordinators._id': { $in: ids }
  }
}
