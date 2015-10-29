# Open Budget: Oakland

##Installation

Prerequisites: 

- node
- npm
- mongo

Clone this and checkout the `keystone` branch.

Navigate to this directory and run `npm install` to install all the dependencies.

##Running the app locally

Start MongoDB by running `mongod` from a command prompt.

In another command prompt, navigate to this directory and start the server by running `node keystone` or `npm start` or whatever is your favorite way to do this (protip: I have been using [nodemon](http://nodemon.io/) in development, which auto-restarts the server when you make code changes). 

That's it! The first time you run the server it should install some data fixtures and create a default admin user (email: ian.macfarland@gmail.com, password: admin). 

You can access the CMS admin at localhost:3000/keystone
