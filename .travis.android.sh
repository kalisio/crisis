#!/bin/bash
source .travis.env.sh

#
# Provision the required files
#
travis_fold start "provision"

# Install the kdk if required
if [ $FLAVOR != "prod" ]
then
	source .travis.kdk.sh
fi

# Install the required secret files requied to sign the app
cp workspace/common/android/*.json src-cordova/
cp workspace/$FLAVOR/android/*.json src-cordova/
cp workspace/common/android/$GOOGLE_KEYSTORE src-cordova/	

travis_fold end "provision"

#
# Build the app
#
travis_fold start "build"

# Overwrite the title in dev/test flavor
if [ $FLAVOR != "prod" ]
then
	TITLE=$TITLE-$FLAVOR
fi

# Build and deploy the mobile app	
npm run cordova:build:android > android.build.log 2>&1
# Capture the build result
BUILD_CODE=$?
# Copy the log whatever the result
aws s3 cp android.build.log s3://$BUILDS_BUCKET/$BUILD_NUMBER/android.build.log
if [ $BUILD_CODE -ne 0 ]; then
	exit 1
fi

# Backup the android build to S3
aws s3 sync src-cordova/platforms/android/app/build/outputs/apk s3://$BUILDS_BUCKET/$BUILD_NUMBER/android > /dev/null
if [ $? -eq 1 ]; then
	exit 1
fi

travis_fold end "build"

#
# Deploy the app
#
travis_fold start "deploy"

# Generate the Appfile
echo "json_key_file(\"google-play.json\")" > src-cordova/fastlane/Appfile
echo "package_name(\"$PACKAGE_ID\")" >> src-cordova/fastlane/Appfile

# Deploy the APK to GooglePlay
cd src-cordova
fastlane android $FLAVOR > android.deploy.log 2>&1
DEPLOY_CODE=$?
cd ..
# Copy the log whatever the result
aws s3 cp src-cordova/android.deploy.log s3://$BUILDS_BUCKET/$BUILD_NUMBER/android.deploy.log
if [ $DEPLOY_CODE -ne 0 ]; then
	exit 1
fi

travis_fold end "deploy"

