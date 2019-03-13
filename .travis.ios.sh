#!/bin/bash
if [[ $TRAVIS_COMMIT_MESSAGE == *"[skip ios]"* ]]
then
	echo "Skipping ios stage"
else
	source .travis.env.sh

	#
  # Provison pre-requisites
	#
	travis_fold start "provision"

	# Download app artifcat
	aws s3 sync s3://$APP-builds/$TRAVIS_BUILD_NUMBER/dist cordova/www > /dev/null
  
	# Clone private repo containing the secret files
	echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
	git clone -b $APP https://github.com/kalisio/kdk-workspaces workspace

	# Create a custom keychain
	security create-keychain -p travis ios-build.keychain
	security default-keychain -s ios-build.keychain
	security unlock-keychain -p travis ios-build.keychain
  security set-keychain-settings -t 3600 -l ~/Library/Keychains/ios-build.keychain

	# Add certificates to keychain and allow codesign to access them
	# see: https://github.com/travis-ci/travis-ci/issues/6791#issuecomment-261215038
	security import workspace/common/ios/AppleWWDRCA.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
	security import workspace/common/ios/ios_distribution.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
	security import workspace/common/ios/ios_distribution.p12 -k ~/Library/Keychains/ios-build.keychain -P $APPLE_P12_PASSWORD -T /usr/bin/codesign
	security import workspace/common/ios/apns_distribution.cer -k ~/Library/Keychains/ios-build.keychain -T /usr/bin/codesign
	security import workspace/common/ios/apns_distribution.p12 -k ~/Library/Keychains/ios-build.keychain -P $APPLE_P12_PASSWORD -T /usr/bin/codesign
	# see: https://docs.travis-ci.com/user/common-build-problems/#mac-macos-sierra-1012-code-signing-errors
  security set-key-partition-list -S apple-tool:,apple: -s -k travis ios-build.keychain

	# Install the required secret files requied to build and sign the app
	cp workspace/$FLAVOR/ios/build.json cordova/.
	mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
	cp workspace/$FLAVOR/ios/*.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/
  
	travis_fold end "provision"
  
	#
	# Build the app
	#
	travis_fold start "build"
	
	# Build the app
	npm run cordova:build:ios > ios.build.log 2>&1
	# Capture the build result
	BUILD_CODE=$?
	# Copy the log whatever the result
	aws s3 cp ios.build.log s3://$APP-builds/$TRAVIS_BUILD_NUMBER/ios.build.log
	# Exit if an error has occured
	if [ $BUILD_CODE -ne 0 ]; then
		exit 1
	fi

  # Backup the ios build to S3
	aws s3 sync cordova/platforms/ios/build/device s3://$APP-builds/$TRAVIS_BUILD_NUMBER/ios > /dev/null
	if [ $? -eq 1 ]; then
		exit 1
	fi

	travis_fold end "build"
  
	#
  # Deploy the IPA to the AppleStore
	#
	travis_fold start "deploy"

	ALTOOL="/Applications/Xcode.app/Contents/Applications/Application Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Support/altool"
	"$ALTOOL" --upload-app -f "./cordova/platforms/ios/build/device/$APP.ipa" -u "$APPLE_ID" -p "$APPLE_APP_PASSWORD" > ios.deploy.log 2>&1
	# Capture the deploy result
	DEPLOY_CODE=$?
	# Copy the log whatever the result
	aws s3 cp ios.deploy.log s3://$APP-builds/$TRAVIS_BUILD_NUMBER/ios.deploy.log
	# Exit if an error has occured
	if [ $DEPLOY_CODE -ne 0 ]; then
		exit 1
	fi

	travis_fold end "deploy"
fi
