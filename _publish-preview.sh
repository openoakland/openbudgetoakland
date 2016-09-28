#!/bin/bash

# Publish site changes to staging site

URL="staging.openbudgetoakland.org"
# BASEDIR=$(dirname $0)
FILE="../_staging/CNAME"
COUNTER=$((COUNTER+1))

# go to the 'source file' directory
cd _src
# compile files to 'staging' directory
harp compile ./ ../_staging
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
