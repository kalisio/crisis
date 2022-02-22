#!/bin/bash
chmod 0600 /home/travis/.netrc
pod install --project-directory='./platforms/ios/'
