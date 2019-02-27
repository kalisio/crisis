#!/bin/bash
if [[ $TRAVIS_COMMIT_MESSAGE == *"[skip deploy]"* ]]
then
	echo "Skipping deploy stage"
else
	source .travis.env.sh

	# Retrieve the ssh pem
	echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
	git clone -b $APP https://github.com/kalisio/kdk-workspaces workspace
	cp workspace/$FLAVOR/ssh.pem ssh.pem

	# Enable ssh pem
	eval "$(ssh-agent -s)"
	chmod 600 ssh.pem
	ssh-add ssh.pem
	ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_REMOTE} mkdir -p ${APP}

	# Deploy environment file
	scp .env ${SSH_USER}@${SSH_REMOTE}:~/${APP}/.env

	# Deploy compose files
	scp deploy/app.yml ${SSH_USER}@${SSH_REMOTE}:~/${APP}/app.yml
	scp deploy/app.swarm.yml ${SSH_USER}@${SSH_REMOTE}:~/${APP}/app.swarm.yml
	scp deploy/mongodb.yml ${SSH_USER}@${SSH_REMOTE}:~/${APP}/mongodb.yml
	scp deploy/mongodb.swarm.yml ${SSH_USER}@${SSH_REMOTE}:~/${APP}/mongodb.swarm.yml

	# Deploy utilities
	scp deploy/deploy-app.sh ${SSH_USER}@${SSH_REMOTE}:~/${APP}
	scp deploy/remove-app.sh ${SSH_USER}@${SSH_REMOTE}:~/${APP}
	ssh ${SSH_USER}@${SSH_REMOTE} "cd ${APP}; chmod u+x ./remove-app.sh; chmod u+x ./deploy-app.sh"

	# Deploy the stack
	ssh ${SSH_USER}@${SSH_REMOTE} "cd ${APP}; sudo ./remove-app.sh; sudo k-swarm-prune; sudo ./deploy-app.sh"
fi

