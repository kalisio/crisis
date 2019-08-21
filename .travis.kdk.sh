#!/bin/bash

# kCore
git clone -b $TRAVIS_BRANCH --depth 1 https://github.com/kalisio/kCore kCore && 
cd kCore
yarn && yarn link
cd .. 


# kTeam
git clone -b $TRAVIS_BRANCH --depth 1 https://github.com/kalisio/kTeam kTeam
cd kTeam 
yarn && yarn link 
yarn link @kalisio/kdk-core
cd .. 

# kNotify
git clone -b $TRAVIS_BRANCH --depth 1 https://github.com/kalisio/kNotify kNotify
cd kNotify
yarn && yarn link
yarn link @kalisio/kdk-core
cd .. 

# Wweacast-core
git clone -b master --depth 1 https://github.com/weacast/weacast-core.git weacast-core
cd weacast-core
yarn && yarn link
cd ..

# Wweacast-leaflet
git clone -b master --depth 1 https://github.com/weacast/weacast-leaflet.git weacast-leaflet
cd weacast-leaflet
yarn && yarn link
yarn link weacast-core
cd ..

# kMap
git clone -b $TRAVIS_BRANCH --depth 1 https://github.com/kalisio/kMap kMap
cd kMap
yarn && yarn link 
yarn link @kalisio/kdk-core
yarn link weacast-core
yarn link weacast-leaflet
cd .. 

# kEvent
git clone -b $TRAVIS_BRANCH --depth 1 https://github.com/kalisio/kEvent kEvent
cd kEvent
yarn && yarn link 
yarn link @kalisio/kdk-core
yarn link @kalisio/kdk-team
yarn link @kalisio/kdk-notify
yarn link @kalisio/kdk-map
yarn link weacast-core
yarn link weacast-leaflet
cd .. 

# kBilling
git clone -b $TRAVIS_BRANCH --depth 1 https://github.com/kalisio/kBilling kBilling
cd kBilling
yarn && yarn link 
yarn link @kalisio/kdk-core
cd .. 

yarn link @kalisio/kdk-core 
yarn link @kalisio/kdk-team
yarn link @kalisio/kdk-notify
yarn link @kalisio/kdk-map
yarn link @kalisio/kdk-event
yarn link @kalisio/kdk-billing
yarn link weacast-core
yarn link weacast-leaflet

