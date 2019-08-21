#!/bin/bash
if [[ $TRAVIS_COMMIT_MESSAGE == *"[skip test]"* ]]
then
	echo "Skipping test stage"
else
	source .travis.env.sh

	# It first need to create the required network 
	docker network create --attachable $DOCKER_NETWORK

	#
	# Test the api
	#
	travis_fold start "api"

	# Output directory for server coverage
	mkdir server-coverage
	chmod -R 777 server-coverage

  # Run the app
	docker-compose -f deploy/app.yml -f deploy/mongodb.yml up -d mongodb
	ERROR_CODE=$?
	if [ $ERROR_CODE -eq 1 ]; then
		echo "Running MongoDB failed [error: $ERROR_CODE]"
		exit 1
	fi
 
  # Run the API tests
	docker-compose -f deploy/app.yml -f deploy/mongodb.yml -f deploy/app.test.server.yml up app
  ERROR_CODE=$?
	if [ $ERROR_CODE -eq 1 ]; then
		echo "Testing ${APP} API failed [error: $ERROR_CODE]"
		exit 1
	fi

  # Backup the server coverages
	codeclimate-test-reporter < server-coverage/lcov.info
	aws s3 cp server-coverage dist s3://$BUILDS_BUCKET/$BUILD_NUMBER/server-coverage > /dev/null
	if [ $? -eq 1 ]; then
		exit 1
	fi

  travis_fold end "api"

  #
	# Test the client
	#
  travis_fold start "client"

	# Output directory for client screenshots
	mkdir client-screenshots
	chmod -R 777 client-screenshots
  
	# Run the app
	docker-compose -f deploy/app.yml -f deploy/mongodb.yml -f deploy/app.test.client.yml up -d app
  ERROR_CODE=$?
	if [ $ERROR_CODE -eq 1 ]; then
		echo "Running ${App} failed [error: $ERROR_CODE]"
		exit 1
	fi

	# Run client tests
	docker-compose -f deploy/app.yml -f deploy/mongodb.yml -f deploy/app.test.client.yml up testcafe
	ERROR_CODE=$?
	# Copy the screenshots whatever the result
	aws s3 sync client-screenshots s3://$BUILDS_BUCKET/$BUILD_NUMBER/client-screenshots > /dev/null
	if [ $ERROR_CODE -eq 1 ]; then
		echo "Testing ${App} frontend failed [error: $ERROR_CODE]"
		exit 1
	fi

	travis_fold end "client"
fi
