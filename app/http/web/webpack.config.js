const path = require('path');


const config = {

  watch: true,

  entry: {
      indexPage: './src/index.jsx',
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/dist',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loaders: [
          'babel-loader',
        ],
        exclude: '/node_modules',
      },
    ],
  },

  devServer: {
        contentBase: "./",
        inline: true,
        port: 8080
    },
};

module.exports = config;