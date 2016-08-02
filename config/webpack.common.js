var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['', '.js', '.ts', '.json']
  },

  module: {
    loaders: [
      {
        test: /\.json/,
        loaders: ['json']
      },
      {
        test: /\.ts/,
        loaders: ['ts']
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.scss/,
        exclude: /node_modules/,
        loader: 'raw!sass'
      },
      {
        test: /\.css/,
        loader: 'raw'
      }
    ]
  },
  node: { fs: 'empty' },

  plugins: [
    new webpack.ProvidePlugin({ CodeMirror: 'codemirror' }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};