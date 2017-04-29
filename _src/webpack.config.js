var path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'js'),
  entry: {
    compare: ['babel-polyfill', './compare/index.jsx'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'js/dist')
  },
  resolve: {
  	extensions: ['.js', '.jsx']
  },
  module: {
  	loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
};