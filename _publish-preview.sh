#!/bin/bash

URL="staging.openbudgetoakland.org"
BASEDIR=$(dirname $0)
FILE="../_staging/CNAME"
COUNTER=$((COUNTER+1))


cd $BASEDIR/_harp 
harp compile ./ ../_staging
echo $URL > $FILE
cd $BASEDIR/_staging && git add -A && git commit -m "preview $COUNTER" && git push
