#!/bin/bash

#
# Provision the required files
#
travis_fold start "provision"

source .travis.env.sh

# Configure rclone
mkdir -p $HOME/.config/rclone
cp $WORKSPACE_DIR/common/rclone.conf $HOME/.config/rclone/.

# Copy the certificates
cp $WORKSPACE_DIR/common/ios/*.cer .
cp $WORKSPACE_DIR/common/ios/*.p12 .
cp $WORKSPACE_DIR/$FLAVOR/ios/*.cer .
cp $WORKSPACE_DIR/$FLAVOR/ios/*.p12 .

# Create a custom keychain
security create-keychain -p travis ios-build.keychain
security default-keychain -s ios-build.keychain
security unlock-keychain -p travis ios-build.keychain
security set-keychain-settings -t 3600 -l ~/Library/Keychains/ios-build.keychain

# Import the certificates into the keychain
security import AppleWWDRCAG3.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
for CERTIFICATE in $APPLE_CERTIFICATES; do
	security import $CERTIFICATE.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
	security import $CERTIFICATE.p12 -k ~/Library/Keychains/ios-build.keychain -P $APPLE_P12_PASSWORD -T /usr/bin/codesign
done

# see: https://docs.travis-ci.com/user/common-build-problems/#mac-macos-sierra-1012-code-signing-errors
security set-key-partition-list -S apple-tool:,apple: -s -k travis ios-build.keychain

# Install the required secret files requied to sign the app
cp $WORKSPACE_DIR/$FLAVOR/ios/build.json src-cordova/.
mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
cp $WORKSPACE_DIR/$FLAVOR/ios/*.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/

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

# Build the app
npm run cordova:build:ios > ios.build.log 2>&1
# Capture the build result
EXIT_CODE=$?
# Copy the log whatever the result
rclone copy ios.build.log scw:kalisio-builds/${BUILD_BUCKET}/ios.build.log
check_code $EXIT_CODE 1 "Building the app"

# Backup the ios build to S3
rclone copy src-cordova/platforms/ios/build scw:kalisio-builds/${BUILD_BUCKET}/ios > /dev/null
check_code $? 0 "Copying the artefact to s3"

travis_fold end "build"

#
# Deploy the app
#
travis_fold start "deploy"

# Deploy the IPA to the AppleStore
xcrun altool --upload-app -t ios -f "./src-cordova/platforms/ios/build/device/$TITLE.ipa" -u "$APPLE_ID" -p "$APPLE_APP_PASSWORD" > ios.deploy.log 2>&1
EXIT_CODE=$?
# Copy the log whatever the result
rclone copy ios.deploy.log scw:kalisio-builds/${BUILD_BUCKET}/ios.deploy.log
check_code $EXIT_CODE 0 "Deploying the app"

travis_fold end "deploy"

