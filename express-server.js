var express = require('express');
var app = express();
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var layout = require('express-layout')

app.set('view engine', 'jade');

app.set('views', __dirname + '/_src');

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, '_src/css'),
    dest: path.join(__dirname, 'tmp/css'),
    includePaths: path.join(__dirname, '_src'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/css',
    template_location:  path.join(__dirname, '_src/css')
}));

app.use('/images', express.static('_src/images'));

app.use(layout())

app.set('layout', '_layout');

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});