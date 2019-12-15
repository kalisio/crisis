#!/bin/bash
#pod repo update
pod setup

mkdir -p ~/.cocoapods/repos
git clone https://github.com/CocoaPods/Specs ~/.cocoapods/repos/master

pod setup

