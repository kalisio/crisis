#!/bin/bash

check_code()
{
   if [[ $1 -ne $2 ]]; then
	  echo "$3 has failed [error: $1]"
	  exit 1
  fi
}

parse_semver()
{
  local REGEXP="^([0-9]+)\.([0-9]+)\.([0-9]+)"
  [[ "$1" =~ $REGEXP ]]
  SEMVER=(${BASH_REMATCH[1]} ${BASH_REMATCH[2]} ${BASH_REMATCH[3]})
}

#
# Provision the required files
#
travis_fold start "provision"

# Define the application name
APP=$(node -p -e "require('./package.json').name")

# Define the application version
VERSION=$(node -p -e "require('./package.json').version")
parse_semver $VERSION
MAJOR=${SEMVER[0]}
MINOR=${SEMVER[1]}
PATCH=${SEMVER[2]}

echo "Building $APP v$MAJOR.$MINOR.$PATCH"

# Define the flavor build
TEST_FLAVOR_REGEX="^test-*|-test$"
PROD_FLAVOR_REGEX="^prod-v[0-9]+\.[0-9]+\.[0-9]+"
if [[ $TRAVIS_TAG =~ $PROD_FLAVOR_REGEX ]];
then
  export FLAVOR=prod
  KLI_FILE=$APP-$VERSION
else
  if [[ $TRAVIS_BRANCH =~ $TEST_FLAVOR_REGEX ]];
  then
    export FLAVOR=test
    KLI_FILE=$APP-$MAJOR.$MINOR
  else
    export FLAVOR=dev
    KLI_FILE=$APP
  fi
fi
export NODE_APP_INSTANCE=$FLAVOR
TAG=$VERSION-$FLAVOR

echo "Build flavor is $FLAVOR on branch $TRAVIS_BRANCH"

# Leave the project directory to avoid Webpack to look for files into the project directory
cd ..

# Clone the workspace where to build the app
git clone https://oauth2:$GITHUB_TOKEN@github.com/kalisio/development.git
export WORKSPACE_DIR=`pwd`/development/workspaces/apps

# Configue the required env
source $WORKSPACE_DIR/apps.sh $APP

# Install the kli
git clone https://github.com/kalisio/kli.git kalisio && cd kalisio && yarn 

# In dev flavor we can build different versions on different branches
# so check if a specific file exists for the target branch first otherwise use default one
if [[ -f $WORKSPACE_DIR/$APP/$FLAVOR/$KLI_FILE-$TRAVIS_BRANCH.js ]];
then
  cp $WORKSPACE_DIR/$APP/$FLAVOR/$KLI_FILE-$TRAVIS_BRANCH.js $APP.js
else
  cp $WORKSPACE_DIR/$APP/$FLAVOR/$KLI_FILE.js $APP.js
fi

# Clone the project and install the dependencies
node . $APP.js --clone
node . $APP.js --install
node . $APP.js --link

travis_fold end "provision"

#
# Build the app
#
travis_fold start "build"

cd $APP
yarn pwa:build
EXIT_CODE=$? 
check_code $EXIT_CODE 0 "Builing the client" 

# Log in to docker before building the app because of rate limiting
docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
check_code $? 0 "Connecting to Docker"

# Create an archive to speed docker build process
cd ../..
tar --exclude='$APP/test' -zcf $TRAVIS_BUILD_DIR/kalisio.tgz kalisio

# Build the image
cd $TRAVIS_BUILD_DIR
docker build --build-arg APP=$APP --build-arg FLAVOR=$FLAVOR --build-arg BUILD_NUMBER=$BUILD_NUMBER -f dockerfile -t kalisio/$APP:$TAG . 
check_code $? 0 "Building the app docker image"

travis_fold end "build"

#
# Deploy the app
#
travis_fold start "deploy"

# Push the app image to the hub with the version tag
docker push kalisio/$APP:$TAG
check_code $? 0 "Pushing the $APP:$TAG docker image"

# Push the app image to the hub with the flavor tag
docker tag kalisio/$APP:$TAG kalisio/$APP:$FLAVOR
docker push kalisio/$APP:$FLAVOR
check_code $? 0 "Pushing the $APP:$TAG docker image"

travis_fold end "deploy"
