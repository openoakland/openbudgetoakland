# Open Budget: Oakland

##Active Development

As of October 2015, it's happening on the `keystone` branch -- we are in the process of rebuilding this project as a Node application using the [KeystoneJS](http://keystonejs.com/) content management system.

Our roadmap for that, insofar as it exists, is [here](https://github.com/openoakland/openbudgetoakland/milestones/rebuild%20with%20a%20CMS).



---

__Fork me!__

Fork and clone the project!

```
git clone git@github.com:[your-user]/openbudgetoakland.git
```

- cd, checkout to branch

---
## Developing Locally

### Harp

This site is built on Harp using Node.js That means you can run it locally with minimal setup!

What you'll need:

-  [Node](http://nodejs.org/download/)
-  [npm](https://www.npmjs.org/)
-  [Harp](http://harpjs.com/)


### Install & Run Harp

Once you have npm installed, you can install Harp

```
# to install harp for the first time
npm install harp -g
```

```
# To start the Harp server, cd to the _src directory
cd [repo-location]/_src
harp server
```

## Making Changes

This project is coded with:

- [jade](http://jade-lang.com/)
- [Sass](http://sass-lang.com/)
- [Bootstrap](http://getbootstrap.com/)


## Creating & Editing Pages

- Page content is inserted into the layout.jade file (which includes basic header and footer snippets)
- Create your .jade file
- Add a link to the main nav in the appropriate place
- Add relevant metadata in _data.json (page title, page slug (url), ...)
- If your page uses custom page-specific css, add it to a new .scss partial and import it into the main stylesheet. (Make sure to namespace it the same way the others are.)


### Adding additional datasets to the Flow diagram page

This chart takes as input the full budget datatable from data.oaklandnet.com
(in CSV format)

Right now the 2015-17 Proposed page is an unpublished placeholder, pending the data release. When the data becomes available: 

1. add the CSV to `_src/data/proposed_1517_flow/` and **remove the placeholder file FY13-14__FY14-15.csv**
1. rename the file to include the two fiscal years it includes, separated by two underscores ("FY15-16__FY16-17.csv")
1. open the csv and make sure all column headings are standardized to the following names:
    - budget_year
    - department
    - division
    - org_code
    - org_description
    - fund_code
    - fund_description
    - account_type (this should be the Expense/Revenue column, if there are duplicate names)
    - account_category
    - account_code
    - account_description
    - amount
    - (any other columns should be deleted)
1. test it in Harp in the dev branch, and it should compile properly for deployment

## Publishing Changes
Make changes on your personal fork or branch. If you have repo access, and your changes are ready for review, you can merge them into the development branch and publish to the staging site for review. You can also publish changes to your own server and merge to development afterwards.

### Publishing to Staging
If you have access to the openoakland repo, you can easily publish a preview of your changes to [staging.openbudgetoakland.org](http://staging.openbudgetoakland.org) with the script below.

```
# Run shell script to publish changes from your current branch to the staging 
# Because of path referencing, you'll need to run this script from inside the _src directory for now
bash ../_publish-preview.sh
```

### Publishing to Production

Even though Harp runs locally, static files need to be compiled for the live site (hosted on Github pages).
Once you have made all your changes, you'll need to compile everything in order for it to run on gh-pages. Because of how Harp compiles (that it clears the target directory), this workflow gets a bit wonky. We'll try to make it a little less fragile if people begin publishing changes more often.


```
# make sure your repo is up to date and you are on the master branch
git fetch
git checkout master

# merge your changes from your branch or development into master
git merge origin/development

# here's where it gets hacky - open to suggestions for an improved workflow
# delete the gh-pages branch and then recreate it as an orphan (untracked) branch
git branch -D gh-pages
git checkout --orphan gh-pages

# move into the _src directory and compile source files to the root
cd _src
harp compile ./ ../

# move back to the root, and add and commit files
cd ../
git add -A
git commit -m "deploy"
  
# push changes to remote gh-pages branch using *gasp* --force! 
# !!! Never push --force on any public branch besides gh-pages!
git push --set-upstream origin gh-pages --force  

# make sure your changes are showing up and you didn't break anything
```

# merge your changes from your branch or development into master
git merge origin/development

If you are on a forked branch, create a pull request to have your changes reviewed for merge!

If you are on a forked branch, create a pull request to have your changes reviewed for merge!
