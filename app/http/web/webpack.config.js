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
        test: /\.jsx?$/,
        use: [
          'babel-loader'
        ],
        exclude: '/node_modules',
      },
      {
        test: /\.png$/,
        use: [
          'file-loader'
        ],
        exclude: '/node_modules',
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: __dirname + '/src'
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