const webpack = require('webpack'),
  path = require('path');

module.exports = {
  watch: true,
  devtool: 'cheap-inline-module-source-map',

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

  eslint: {
    configFile: '/.eslintrc'
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        unused: true,
        collapse_vars: true,
      }
    })
  ]
};
