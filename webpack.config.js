const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
   entry: './main.js',
   output: {
      path: path.join(__dirname, '/bundle'),
      filename: 'bundle.js'
   },
   devServer: {
      inline: true,
      port: 8080
   },
   module: {
      rules: [
         {
            test: /\.js/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015', 'react']
            }
         },
         {
            test: /\.css/,
            use:[
               MiniCssExtractPlugin.loader,
               'css-loader'
            ]
         }
      ]

   },
   plugins:[
      new HtmlWebpackPlugin({
         template: './index.html'
      }),
      new MiniCssExtractPlugin({
         filename: "style.css"
       })
   ]
}