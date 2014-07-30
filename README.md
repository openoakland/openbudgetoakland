# Open Budget: Oakland

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
$ npm install harp -g
```

```
# To start the Harp server, cd to the _src directory
$ cd [repo-location]/_src
$ harp server
```

## Making Changes

This project is coded with:

- [jade](http://jade-lang.com/)
- [Sass](http://sass-lang.com/)
- [Bootstrap](http://getbootstrap.com/)



## Adding & Editing Pages

- update metadata in _data.json (page title, page slug (url), ...)


## Publishing Changes

### Publishing a preview
If you have access to the openoakland repo, you can easily publish a preview of your changes to [staging.openbudgetoakland.org](http://staging.openbudgetoakland.org) with the script below.

```
# Run shell script
bash _publish-preview.sh
```

### Compiling Static Files

Even though Harp runs locally, static files need to be compiled for the live site (hosted on Github pages).
Once you have made all your changes, you'll need to compile everything in order for it to run on gh-pages.

*__make script to compile and publish to root__

```
$ harp compile _src ./
# Make sure you are in the directory root of the repository
```


### Commit and Push
Now just make your final commit, and push your changes to the gh-pages branch.

```
$ git add -A
$ git commit -m "[your commit message]"
$ git push
```

If you are on a forked branch, create a pull request to have your changes reviewed for merge!

