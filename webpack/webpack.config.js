const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const InterpolateHtmlPlugin = require('interpolate-html-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const publicPath = '/'
const publicUrl = ''
// Get environment variables to inject into our app.
const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PUBLIC_URL: publicUrl,
}

const root = path.resolve(__dirname, '..')

const pathsToClean = [
  'dist',
  'build',
]
const cleanOptions = {
  root,
  exclude: ['shared.js'],
  verbose: true,
  dry: false,
}

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    app: './src/index.js',
  },
  output: {
    pathinfo: true,
    filename: 'js/main.js',
    path: path.resolve(root, 'dist'),
    chunkFilename: 'js/[name].chunk.js',
    publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx)$/,
        enforce: 'pre',
        use: {
          loader: 'eslint-loader',
        },
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
            },
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
              },
            ],
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: [
              'style-loader',
              { loader: 'css-loader', options: { importLoaders: 1 } },
              'postcss-loader',
            ],
          },
          {
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
      inject: true,
    }),
    new FaviconsWebpackPlugin('./public/favicon.png'),
    new InterpolateHtmlPlugin(env),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: publicPath,
    }),
    new CopyWebpackPlugin([{ from: './public/manifest.json', to: './' }]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     name: false,
  //   },
  //   runtimeChunk: true,
  // },
}
