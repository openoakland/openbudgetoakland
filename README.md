# Open Budget: Oakland

## Contributing

If you're looking for a starter development task to get your feet wet with our codebase, any of our Issues tagged [help wanted](https://github.com/openoakland/openbudgetoakland/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) might be a good fit. 

Some of the other Issues are larger and require some deeper design or architectural work; if one of those catches your eye, you'll probably want to talk with us for some more context and background. Either comment on the Issue or — even better — catch up with us at one of [OpenOakland's weekly Hack Nights](https://www.openoakland.org/).

## Developing Locally

### Quick Start Guide

1. Sign into GitHub and fork this repo
1. Clone the fork onto your machine and navigate to the _src/ folder
1. Install yarn (e.g., run ```brew update``` plus ```brew install yarn --ignore-dependencies``` on a Mac)
1. Install Harp globally (e.g., run ```yarn global add harp``` on a Mac) 
 - NB If you cannot install the latest version of the Harp NPM package you may need to update your operating system, else revert to v0.29.0 (e.g., run ```yarn global remove harp``` followed by ```yarn global add harp^0.29```)
1. Start the Harp server by running ```harp server```
1. In a new terminal window, navigate to _src/ again and run ```yarn install``` followed by ```yarn run watch```

Your local copy of Open Budget Oakland's website should now be running at http://localhost:9000.

### Harp

This site is built on Harp using Node.js. That means you can run it locally with minimal setup!

What you'll need:

-  [Node](http://nodejs.org/download/)
-  [Yarn](https://yarnpkg.com/en/)
-  [Harp](http://harpjs.com/)


### Install & Run Harp

Once you have the Yarn package manager installed, you can install Harp globally

```
# to install harp for the first time
yarn global add harp
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
- [React](https://facebook.github.io/react/)


## Creating & Editing Pages

- Please note that it is your responsibility to keep your fork of the repo up-to-date with changes made by others working on the project. Doing this diligently should go a long way towards protecting you from scary git merge conflicts.
- All development activity occurs in `_src/`. The root folder is only for compiled output for deployment.
- Make sure NODE_ENV in your shell environment is set to 'development'! Setting it to 'production' will trigger prod-only features such as Google Analytics that you don't want to run in any environment other than our live site.
- Page content is inserted into the `layout.jade` file (which includes basic header and footer snippets)
- Create your `.jade` file
- Add a link to the main nav in the appropriate place
- Add relevant metadata in `_data.json` (page title, page slug (url), ...)
- If your page uses custom page-specific css, add it to a new `.scss` partial and import it into the main stylesheet. (Make sure to namespace it the same way the others are.)


### Additional instructions for "flow" diagram pages

1. Flow pages are built off a template; copy one of the `*-budget-flow.jade` pages and update the content blocks as necessary.
1. Data files must be placed in the `data/flow` directory. Follow the naming convention seen there or your files won't load properly. You also will need to point your page at the appropriate files as seen in the `get_datafiles` content block.
1. the following columns are required in your datafile and their names should be normalized as seen here. Other columns should be removed to minimize the data download.
    - budget_year
    - department
    - fund_code
    - account_type (this should be the Expense/Revenue column, if there are duplicate names)
    - account_category
    - amount

### Additional instructions for treemap diagram pages

1. Treemap pages are built off a template; copy one of the `*-budget-tree.jade` pages and update the content blocks as necessary.
1. Instructions for generating the necessary data files can be found [here](_treemap/README.md). Add them to the `data/tree/` directory following the naming convention seen in the existing files.
1. Update the `datafiles` content block with the appropriate metadata and file path for the data files you generated.

### Additional instructions for the Compare page

1. The Compare page is mainly powered by a React application. The source files are in `_src/js/compare/` and are are bundled with [Webpack](https://webpack.js.org/).
1. When developing on the Compare page, run `yarn` to install all the necessary node dependencies and `yarn run watch` to watch the source files for changes and rebuild the asset bundles accordingly.
1. The Compare page communicates with a separately maintained API to fetch its data. Documentation for that API can be found [in our wiki](https://github.com/openoakland/openbudgetoakland/wiki/API-Documentation).

## Publishing Changes
Make changes and review them on your local development site. If everyting looks good, push your changes to your personal fork and merge the commit(s) into your master branch. We'll take it from there!

### Details

Simply push your code changes to your repo in whatever branch you used locally, then merge into master. At this point you can either 1) push from your master to the **staging** branch of the upstream repo or 2) just tell an admin of the upstream repo that your work is ready for review. (Anyone with admin privileges on the original repo will be able to create a pull request from your repo). Your changes will then be reviewed, tested, and (if everything looks good) pushed into the master branch.

Starting in March 2020, code changes pushed to the master branch of the (original) repo will use GitHub Actions to trigger a continuous integration process that (among other things):
 
 - runs WebPack;
 - builds static files with Harp; and
 - deploys the updated files to GitHub Pages

## Generating the API

### Background

Oakland budget data are hosted in a special table that lives in the database of a WordPress site. This site exists primarily for the purpose of managing this data, and is not intended for public consumption. Should you need access to the backend of the site, please contact Felicia on Slack.

The API we have built is completely independent of the Open Budget Oakland site, and can be consumed by anyone. Thus far, we have not had to place any limits on traffic to the server, but that may change in the future. To learn how to use the API, please see the documentation in our GitHub wiki.

### Using the plugin to generate the API

The WordPress plugin (OBO Custom Routes) that generates our API can be installed and used on any WordPress site, providing a database table with the expected column names is present. Currently, the plugin is hard-coded to expect a table called ```oakland_budget_items```. Obviously, that would be something you'd want to change if you were to use the plugin for another project. Additionally, database queries can easily be altered to fit a different table structure and to create different kinds of endpoints with a bit of PHP skill.

### Developing locally

To develop new features for the API, you may want to run Wordpress locally. 
This repo includes a configuration file for doing so with [Docker Compose](https://docs.docker.com/compose/).
With Docker Compose installed, simply run `docker-compose up` in `wordpress plugin for custom API endpoints/` 
to activate linked containers for Wordpress, MySQL, and PhpMyAdmin. The Wordpress container will
mount that directory as though it were Wordpress' `plugins/` directory, allowing your edits to 
the plugin files in `obo_custom_routes/` to be reflected in your Wordpress instance. (Additional plugins that
are not part of this repository will appear in that directory; they should be ignored by git.)
