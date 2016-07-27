var express = require('express');
var app = express();
var sassMiddleware = require('node-sass-middleware');
var path = require('path');

app.set('view engine', 'jade');

app.set('views', __dirname + '/_src');

app.use(
  sassMiddleware({
    src: path.join(__dirname, '_src/css'),
    dest: path.join(__dirname, 'tmp/css'),
    includePaths: path.join(__dirname, '_src'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/css',
    template_location:  path.join(__dirname, '_src/css'),
    force: true
  })
);

app.use('/images', express.static('_src/images'));

var pageSlugs = [
  'index',
  'what-we-do',
  'who-we-are',
  'news',
  'contact',
  'feedback',
  'budget-visuals',
  'city-of-oakland-budget',
  'oakland-budget-101',
  'tools-projects',
  'budget-process',
  '2011-2013-adopted-budget',
  '2012-2013-sankey',
  '2013-15-adopted-budget-landing',
  '2013-2015-adopted-budget-flow',
  '2013-2015-adopted-budget',
  '2015-17-proposed-budget-flow',
  '2015-17-proposed-budget-tree',
  'discuss',
  'mayor-2013-2015-proposed',
  'public-2013-2015',
  'updated-mayor-2013-2015-proposed'
]  

function renderJade(name, res) {
  if (pageSlugs.indexOf(name) == -1) {
    throw new Error("\""+name+"\" is not a page we know about.")
  }

  res.render(name, function(err, str) {
    res.render('_layout', {yield: str});
  });
}

app.get('/', function(req, res) {
  renderJade('index', res)
});

app.get('/:slug.html', function(req, res) {
  console.log("SLUG!", req.params.slug)
  renderJade(req.params.slug, res)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});