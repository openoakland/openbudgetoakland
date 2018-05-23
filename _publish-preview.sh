#!/bin/bash

# Publish site changes to staging site

URL="staging.openbudgetoakland.org"
# BASEDIR=$(dirname $0)
FILE="../_staging/CNAME"
# for staging, we want a development build.
# this will reserve certain features (e.g. Google Analytics) 
# for the production site only
NODE_ENV=development
COUNTER=$((COUNTER+1))

# go to the 'source file' directory
cd _src
# build webpack bundles
yarn run build
# compile files to 'staging' directory
# harp needs to ignore node stuff
mv -f node_modules _node_modules
harp compile ./ ../_staging
mv -f _node_modules node_modules
# update CNAME file with staging url
echo $URL > $FILE
# ask for description of commit
echo "Briefly describe your changes: "
read MESSAGE
# commit preview files and push to github
cd ../_staging
git checkout gh-pages
git add -A
git commit -m "$TIMESTAMP: $MESSAGE"
git push
