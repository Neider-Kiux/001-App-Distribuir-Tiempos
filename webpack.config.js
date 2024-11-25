const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {resolve, join} = require('path');

const Entradas = {
  index: './src/js/index.js',
};

const Optimizacion = {};

const Reglas = [
  {
    test: /\.(scss|css)$/,
    use: [MiniCssExtractPlugin.loader, {loader: 'css-loader', options: {url: false}}, 'postcss-loader', 'sass-loader'],
    //NOTE: Para que se genere un css nuevo en la ruta que se indica en el MiniCssExtractPlugin no se deve agregar el style-loader
  },
  {
    test: /\.(gif|png|jpe?g|ico|svg)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: './img/',
        },
      },
    ],
  },
];

const Complementos = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './src/index.html',
    favicon: './src/img/favicon.ico',
    inject: false,
  }),
  new MiniCssExtractPlugin({filename: 'css/[name].css'}),
  // new CssMinimizerPlugin(),
];

const ServidorDesarrollo = {
  static: {
    directory: join(__dirname, './build'),
  },
  compress: false,
  port: 9015,
  host: '0.0.0.0',
};

const Salida = {
  path: resolve(__dirname, 'build'),
  filename: 'js/[name].js',
  chunkFilename: 'js/modules/mod-[id].js',
};

module.exports = {
  entry: Entradas,
  optimization: Optimizacion,
  output: Salida,
  plugins: Complementos,
  module: {rules: Reglas},
  devServer: ServidorDesarrollo,
};
