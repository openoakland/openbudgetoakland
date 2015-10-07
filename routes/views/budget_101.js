var keystone = require('keystone'),
	Page = keystone.list('Page');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// get the page content
	Page.model.findOne({title: "Oakland Budget 101"})
		.exec()
		.then(function(win){
			if (win) {
				// Render the view
				view.render('8col', win);	
			} else {
				view.render('errors/500');
			}
		}, function(fail){
			console.log(fail);
		})
};
