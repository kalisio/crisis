#!/bin/bash

#
# Provision the required files
#
travis_fold start "provision"

source .travis.env.sh

# Configure rclone
mkdir -p $HOME/.config/rclone
cp $TRAVIS_BUILD_DIR/workspace/common/rclone.conf $HOME/.config/rclone/.

# Install the required secret files requied to sign the app
cp $TRAVIS_BUILD_DIR/workspace/common/android/*.json src-cordova/
cp $TRAVIS_BUILD_DIR/workspace/$FLAVOR/android/*.json src-cordova/
cp $TRAVIS_BUILD_DIR/workspace/common/android/$GOOGLE_KEYSTORE src-cordova/	

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
EXIT_CODE=$?
# Copy the log whatever the result
rclone copy android.build.log scw:kalisio-builds/${BUILD_BUCKET}/android.build.log
check_code $EXIT_CODE "Building the app"

# Backup the android build to S3
rclone copy src-cordova/platforms/android/app/build/outputs/apk scw:kalisio-builds/${BUILD_BUCKET}/android > /dev/null
check_code $? "Copying the artefact to s3"

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
fastlane android $NODE_APP_INSTANCE > android.deploy.log 2>&1
EXIT_CODE=$?
# Copy the log whatever the result
rclone copy android.deploy.log scw:kalisio-builds/${BUILD_BUCKET}/android.deploy.log
check_code $? "Deploying the app"

travis_fold end "deploy"

