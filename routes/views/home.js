var keystone = require('keystone'),
	Page = keystone.list('Page'),
	VizType = keystone.list('VizType'),
	_ = require('underscore');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	Page.model.findOne()
		.where('section', 'homepage')
		.exec()
		// Page data
		.then(
			function(data){
				// add to locals
				locals.page = data;
				// return promize for VizTypes
				return VizType.model.find()
					.sort('sortOrder')
					.exec();
			},
			function(err){
				throw err;
			}
		)
		// VizTypes data
		.then(
			function(data){
				// generate URLs
				// TODO: find a more obvious location to store this logic
				_.map(data, function(viz){
					viz.url = '/viz/' + viz.slug;
				});

				// add to locals
				locals.viztypes = data;

				// render the page
				view.render('home');
			},
			function(err){
				console.log(err);
				view.render('errors/500');
			}
		);
};
