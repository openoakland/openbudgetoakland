// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

	'name': 'Open Budget: Oakland',
	'brand': 'Open Budget: Oakland',
	
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',

	// database opts
	'mongo': process.env.MONGOLAB_URI || "mongodb://localhost/open-budget-oakland",
	
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',

	// Admin options
	'wysiwyg images': true,
	'wysiwyg cloudinary images': true,
	'wysiwyg additional buttons': 'formatselect removeformat',

	// cloudinary options
	// note: account info must be set in dotenv

	// S3 options: in dotenv

});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'data': ['viz-types', 'datasets'],
	'content': 'pages',
	'users': 'users'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
