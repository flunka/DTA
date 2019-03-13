const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs');




module.exports = (env) =>{


  const currentPath = path.join(__dirname);
    
  // Create the fallback path (the production .env)
  const basePath = currentPath + '/.env';

  // We're concatenating the environment name to our filename to specify the correct env file!
  const envPath = basePath + '.' + env.ENVIRONMENT;

  // Check if the file exists, otherwise fall back to the production .env
  const finalPath = fs.existsSync(envPath) ? envPath : basePath;

    // Set the path parameter in the dotenv config
  const fileEnv = dotenv.config({ path: finalPath }).parsed;

  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});

  return {

  watch: true,

  entry: {
      indexPage: './src/index.jsx',
  },
  output: {
    path: __dirname + '/dist/',
    publicPath: '/dist/',
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

  plugins: [
    new webpack.DefinePlugin(envKeys)
  ],

  devServer: {
        contentBase: "./",
        inline: true,
        port: 8080
    },
};

};