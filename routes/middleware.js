/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore'),
	keystone = require('keystone'),
    Page = keystone.list('Page'),
    sections = require('../models/sections');


/**
	Initialises the standard view locals
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;

	// load the menu data
	locals.sections = {};
	var queried = 0;
	_.each(sections, function(section){
		locals.sections[section] = [];
	})
	
	Page.model.find({section: {$ne: null}})
		.exec(function(err, pages){
			if (err) {
				console.log(err);
			} else {
				_.each(pages, function(page){
					locals.sections[page.section].push({title: page.title, url: '/'+page.section+'/'+page.slug })
				});
			}
			next();
		});
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
	
};
