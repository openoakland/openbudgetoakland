const path = require('path');

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'js'),
  entry: './compare/index.jsx',
  output: {
    filename: 'compare.bundle.js',
    path: path.resolve(__dirname, 'js/dist')
  },
  resolve: {
  	extensions: ['.js', '.jsx']
  },
  module: {
  	rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // was 'es2015'
            cacheDirectory: false
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
};