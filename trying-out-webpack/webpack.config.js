var path = require("path");

module.exports = {
  context: path.resolve('app'),
  entry: './entry',
  output: {
    path: path.resolve('build/js'),
    publicPath: '/public/assets/js/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: 'public'
  }
};
