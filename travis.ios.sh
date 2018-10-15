#!/bin/bash
if [[ $TRAVIS_COMMIT_MESSAGE == *"[skip ios]"* ]]
then
	echo "Skipping ios stage"
else
	source travis.env.sh
	if [[ -n "$TRAVIS_TAG" ]]
	then
		npm run cordova:supply:ios
	else
		npm run cordova:add:ios
		npm run cordova:build
	fi
fi
