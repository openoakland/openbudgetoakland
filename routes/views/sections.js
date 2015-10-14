var keystone = require('keystone'),
	Page = keystone.list('Page'),
	sections = require('../../models/sections'),
	_ = require('underscore');
	

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// get the section: /{section}/{slug}
	var section = req.path.split('/')[1];
	locals.section = section;
	console.log(section)
	if (section == 'feedback') {
		var query = Page.model.findOne({section: section});
		var template = 'feedback';
	} else {
		// get the page content
		var query = Page.model.findOne({section: section, slug: req.params.slug});
		var template = '8col';
	}
	query.exec()
		.then(function(win){
			if (win) {
				// Render the view
				view.render(template, win);	
			} else {
				view.render('errors/404');
			}
		}, function(fail){
			console.log(fail);
			view.render('errors/500');
		})
};
