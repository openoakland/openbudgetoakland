#!/bin/bash

# for the production site, we want production builds!
# this will include Google Analytics (and maybe other stuff?)
# NODE_ENV=production
#
# Summary: compile source files from root
pwd
# install Harp locally at root
npm install harp 
npx harp -V
echo "Harp version"
# create build directory that will only exist on CI server
mkdir ./build
# get rid of the node_modules folder in _src
rm -rf ./_src/node_modules
ls -F ./_src
# use Harp to compile source files to build folder
npx harp compile ./_src ./build
ls -F ./build
# set this back to development so we don't go 
# accidentally running prod code in dev environments
# NODE_ENV=development

