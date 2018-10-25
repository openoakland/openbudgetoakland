# Open Budget: Grand Rapids

## 1. Develop Locally

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

### Create Development Branch
- Create a development branch from the Citizen Labs master for the [Open Budget project.](https://github.com/citizenlabsgr/openbudgetgr).

```
# To start the Harp server, cd to the _src directory
cd [repo-location]/_src
harp server
```

This project is coded with:

- [jade](http://jade-lang.com/)
- [Sass](http://sass-lang.com/)
- [Bootstrap](http://getbootstrap.com/)
- [React](https://facebook.github.io/react/)


## 2. Creating & Editing Pages

- All development activity occurs in `_src/`. The root folder is only for compiled output for deployment.
- Page content is inserted into the `layout.jade` file (which includes basic header and footer snippets)
- Create your `.jade` file
- Add a link to the main nav in the appropriate place
- Add relevant metadata in `_data.json` (page title, page slug (url), ...)
- If your page uses custom page-specific css, add it to a new `.scss` partial and import it into the main stylesheet. (Make sure to namespace it the same way the others are.)

## 3. Instructions for "Flow" Diagram Pages

1. Flow pages are built off a template; copy one of the `*-budget-flow.jade` pages and update the content blocks as necessary.
1. Data files must be placed in the `data/flow` directory. Follow the naming convention seen there or your files won't load properly. **Note: Two underscores required in data file name, ex: FY17__final.csv.** You also will need to point your page at the appropriate files as seen in the `get_datafiles` content block.
1. the following columns are required in your datafile and their names should be normalized as seen here. Other columns should be removed to minimize the data download.
    - budget_year
    - department
    - fund_code
    - account_type (this should be the Expense/Revenue column, if there are duplicate names)
    - account_category
    - amount

## 4. Instructions for "Treemap" Diagram Pages

1. Treemap pages are built off a template; copy one of the `*-budget-tree.jade` pages and update the content blocks as necessary.
1. Instructions for generating the necessary data files can be found [here](_treemap/README.md). Add them to the `data/tree/` directory following the naming convention seen in the existing files.
1. Json files should follow this naming convention, Status (Final, Preliminary, Proposed, etc).Acount Type (Revenue or Expense).Budget Year.json. Examples: `Final.Expense.FY19.json` and `Final.Revenue.FY19.json`
1. Update the `datafiles` content block with the appropriate metadata and file path for the data files you generated.

## 5. Instructions for "Compare" page

1. The Compare page is mainly powered by a React application. The source files are in `_src/js/compare/` and are are bundled with [Webpack](https://webpack.js.org/).
1. When developing on the Compare page, run `yarn` to install all the necessary node dependencies and `yarn run watch` to watch the source files for changes and rebuild the asset bundles accordingly.
1. The Compare page communicates with a separately maintained API to fetch its data. Documentation for that API can be found [in our wiki](https://github.com/openoakland/openbudgetoakland/wiki/API-Documentation).

## 6. Creating/Updating Budget Timeline
The timeline is made using [TimelineJS](http://timeline.knightlab.com), an open-source tool that enables anyone to build visually rich, interactive timelines. Beginners can create a timeline using nothing more than a Google spreadsheet, like the one we used for the Timeline above. Experts can use their JSON skills to create custom installations, while keeping TimelineJS's core functionality.

The Google spreadsheet for the current [Budget Timeline used for Grand Rapids](https://grbudget.citizenlabs.org/budget-process.html) is a Citizen Labs' shared Google Sheet, can be [viewed here.](https://docs.google.com/spreadsheets/d/1jL2_7lJSgbLchJfAGWrST16ZxKe5Z-vbOfrAu14QyG8/edit?usp=sharing)

## 7. Publishing Changes
Make changes on your personal fork or branch. If you have repo access, and your changes are ready for review, you can merge them into the development branch and publish to the staging site for review. You can also publish changes to your own server and merge to development afterwards.
