Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function(){
  this.render('home', {
    data: {
      page: Pages.findOne({role: "homepage"}),
      vizlinks: HomepageVizLinks.find({}, {limit: 3, sort: ['order']}),
    }
  });
})