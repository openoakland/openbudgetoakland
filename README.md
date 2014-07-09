# Open Budget: Oakland

__Fork me!__

Clone the project!
```
git clone git@github.com:openoakland/openbudgetoakland.git

- cd, checkout to branch

---
## Developing Locally

### Harp

This site is built on Harp using Node.js That means you can run it locally with minimal setup!

What you'll need: 
- Node
- npm
- Harp

```
npm install -g harp
```

### Install & Run Harp

[Harp APF](http://github.com/sintaxi/harp) provides you with a local server to run and customize this boilerplate.

```
# to install harp for the first time
$ npm install harp -g
```

## Making Changes

- sass
- bootstrap (overrides/customizations)
- jade


## Adding & Editing Pages

- update metadata in _data.json (page title, page slug (url), ...)


## Publishing Changes
### Compile Static Files

Once you have made all your changes, you'll need to compile everything in order for it to run on gh-pages.

```
$ harp compile _harp ./
# Make sure you are in the directory root of the repository
```

### Publishing a preview
*stub: staging server*

### Commit and Push
Now just make your final commit, and push your changes to the gh-pages branch.
```
$ git add -A
$ git commit -m "[your commit message]"
$ git push
```
_If we stick with GitHub for publishing, and have more contributors, we probably won't want to develop directly onto the gh-pages branch._
