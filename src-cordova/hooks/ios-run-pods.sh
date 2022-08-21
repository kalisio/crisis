#!/bin/bash
chmod 0600 /Users/travis/.netrc
cd ./platforms/ios
pod init
pod install #--project-directory='./platforms/ios/'
