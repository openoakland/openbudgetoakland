# Open Budget: Oakland

__Fork me!__

---
## Developing Locally

### Harp

This site is built on Harp using Node.js That means you can run it locally with minimal setup!

What you'll need: 
- Node
- npm
- Harp

### Install & Run Harp

[Harp APF](http://github.com/sintaxi/harp) provides you with a local server to run and customize this boilerplate.

```
$ npm install harp -g
$ harp server
```

## Making Changes

- sass
- bootstrap (overrides/customizations)
- jade


## Adding & Editing Pages

- update metadata in _data.json (page title, ...)


## Publishing Changes
### Compile Static Files

Once you have made all your changes, you'll need to compile everything in order for it to run on gh-pages.
```
$ harp compile
```
Easy!
### Commit and Push
Now just make your final commit, and push your changes to the gh-pages branch.
```
$ git add -A
$ git commit -m "[your commit message]"
$ git push
```
_If we stick with GitHub for publishing, and have more contributors, we probably won't want to develop directly onto the gh-pages branch._
