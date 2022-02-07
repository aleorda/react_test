const webpack = require("webpack");
const path = require("path");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      https: true,
    },
  },
  entry: ["@babel/polyfill", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "dashboard.[fullhash].js",
    chunkFilename: "dashboard_[id].[contenthash].js",
    library: "react_test",
  },
  plugins: [
      new Dotenv(),
      new HtmlWebpackPlugin({
            template: 'index.html'
          })
  ],
  module: {
    rules: [
    {
            test: /\.html$/,
            use: [
              {
                loader: "html-loader",
              },
            ],
          },
    {
      test: /\.(js|jsx)$/,
      loader: "babel-loader",
      exclude: /node_modules/,
    },
    {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
  },
  {
    test: /\.scss$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          modules: {
            mode: "local",
            exportGlobals: true,
            localIdentName: "[local]",
          },
          importLoaders: 2,
        },
      },
      {
        loader: "sass-loader",
        options: {
          sourceMap: true,
        },
      },
    ],
  },
  ],
  },
};
