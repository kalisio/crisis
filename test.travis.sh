#!/bin/bash
if [[ $TRAVIS_COMMIT_MESSAGE == *"[skip test]"* ]]
then
	echo "Skipping test stage"
else
	source env.travis.sh
	# Required to avoid local build of the image
	docker pull kalisio/aktnmap:${FLAVOR}
	docker-compose -f docker-compose.yml up -d mongodb-aktnmap
	mkdir server-coverage
	docker-compose -f docker-compose.yml -f docker-compose.server-tests.yml up aktnmap
	mkdir client-screenshots
	docker-compose -f docker-compose.yml -f docker-compose.client-tests.yml up -d aktnmap
	docker-compose -f docker-compose.yml -f docker-compose.client-tests.yml up testcafe
fi
