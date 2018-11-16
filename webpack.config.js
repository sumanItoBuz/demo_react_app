const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const htmlPlugin = new HtmlWebpackPlugin({
   template: "./index.html",
   filename: "./index.html"
 });

 const extractCss = new MiniCssExtractPlugin({
   filename: "style.[chunkhash].css"
});

console.log(process.env);

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
            use:[
               {
                  loader:'babel-loader',
                  options:{
                     presets: ['es2015', 'react']
                  }
               },        
            ]
         },
         {
            test: /\.css/,

            use: [
               MiniCssExtractPlugin.loader,
               {
                  loader: 'css-loader',
                  options: {
                     minimize: true
                  }
               }
            ]
         },{
            test: /\.js/,
            exclude: /node_modules/,
            use:[
               {
                  loader: 'string-replace-loader',
                  options:{
                     search: '##API_BASE_PATH##',
                     replace: 'http://5bed7bcd7839000013e6f9b4.mockapi.io/'
                  }
               }        
            ]
         }
      ]
   },
   plugins:[
      htmlPlugin,
      extractCss
   ]
}