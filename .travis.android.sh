#!/bin/bash
if [[ $TRAVIS_COMMIT_MESSAGE == *"[skip android]"* ]]
then
	echo "Skipping android stage"
else
	source .travis.env.sh

  #
	# Provision the required files
	#
	travis_fold start "provision"

	# Retrieve the built Web app
	aws s3 sync s3://$APP-builds/$TRAVIS_BUILD_NUMBER/dist cordova/www > /dev/null

		# Retrieve the secret files
	echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
	git clone -b $APP https://github.com/kalisio/kdk-workspaces workspace
	
	# FIXME  temp
	cp workspace/$FLAVOR/config.xml cordova/config.xml

	# Install the required secret files requied to sign the app
	ls workspace/$FLAVOR/android/
	cp workspace/$FLAVOR/android/*.json cordova/
	cp workspace/$FLAVOR/android/kalisio.keystore cordova/
	cp workspace/$FLAVOR/android/Appfile cordova/fastlane/
	
	travis_fold end "privision"

	#
	# Build the app
	#
	travis_fold start "build"

	# Increment the build number
	export ORG_GRADLE_PROJECT_cdvVersionCode=$TRAVIS_BUILD_NUMBER

	# Build and deploy the mobile app	
	npm run cordova:build:android > android.build.log 2>&1
	# Capture the build result
	BUILD_CODE=$?
	# Copy the log whatever the result
	aws s3 cp android.build.log s3://$APP-builds/$TRAVIS_BUILD_NUMBER/android.build.log
	if [ $BUILD_CODE -ne 0 ]; then
		exit 1
	fi

	# Backup the android build to S3
	aws s3 sync cordova/platforms/android/app/build/outputs/apk s3://$APP-builds/$TRAVIS_BUILD_NUMBER/android > /dev/null
	if [ $? -eq 1 ]; then
		exit 1
	fi

  travis_fold end "build"

  #
  # Deploy the app
	#
	travis_fold start "deploy"

  # Deploy the APK to GooglePlay
	cd cordova
	fastlane android $NODE_APP_INSTANCE > android.deploy.log 2>&1
	DEPLOY_CODE=$?
	cd ..
	# Copy the log whatever the result
	aws s3 cp cordova/android.deploy.log s3://$APP-builds/$TRAVIS_BUILD_NUMBER/android.deploy.log
	if [ $DEPLOY_CODE -ne 0 ]; then
		exit 1
	fi

	travis_fold end "deploy"
fi
