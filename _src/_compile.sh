#!/bin/bash

# for the production site, we want production builds!
# this will include Google Analytics (and maybe other stuff?)
# NODE_ENV=production
#
# Summary: compile source files from root
#
# where am I?
pwd
# document contents of _src
ls -F ./_src
# clear dependencies just in case???
rm -rf ./node_modules
rm -rf ./_src/node_modules
# create build directory that will only exist on CI/CD server
mkdir ./build
cd ./_src
# install dependencies
npm install
# run Sass preprocessor
npm run build-css
# compile source files to build folder
# NB: compilation by 11ty is configured in .eleventy.js
npx @11ty/eleventy
# document contents
ls -F ../build
# set this back to development so we don't go 
# accidentally running prod code in dev environments
# NODE_ENV=development

