#!/bin/bash

# Publish site changes to staging site

URL="staging.openbudgetoakland.org"
BASEDIR=$(dirname $0)
FILE="../_staging/CNAME"
COUNTER=$((COUNTER+1))

# go to the 'source file' directory
cd $BASEDIR/_harp 
# compile files to 'staging' directory
harp compile ./ ../_staging
# update CNAME file with staging url
echo $URL > $FILE
# commit preview files and push to github
cd $BASEDIR/_staging && git add -A && git commit -m "preview $COUNTER" && git push
