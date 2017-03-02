const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'cheap-inline-module-source-map',

  watch: true,

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: { presets: ['es2015'] }
    }],
    preLoaders: [{
      test: /\.js$/,
      loader: 'eslint',
      include: path.resolve(__dirname, '/src/js')
    }]
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        unused: true,
        collapse_vars: true,
      }
    })
  ],

  eslint: {
    configFile: '/.eslintrc'
  },
};
