const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const OUTPUT_DIR = 'dist';

// only form HtmlWebPackPlugin
const config = [
  { site: 'index' }
  // { site: 'index', share: 'share' },
  // { site: 'about', share: 'share' },
  // { site: 'contact' }
];

// configure Resolve
const configureResolveAlias = () => {
  return {
    alias: {
      'assets': path.resolve(__dirname, '../sources/images')
    }
  }
}

// configure Babel Loader
const configureBabelLoader = () => {
  return {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
    },
  }
}

// configure Pug Loader
const configurePugLoader = () => {
  return {
    test: /\.pug$/,
    loader: 'pug-loader',
    options: {
      pretty: true,
      self: true,
    },
  }
}

// configure Fonts loading
const configureFontsLoader = () => {
  return {
    test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
        }
      }
    ]
  }
}

// configure jQuery
const configureJquery = () => {
  return new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
  });
}

// Expose jQuery to project
const exposeJquery = () => {
  return {
      // Exposes jQuery for use outside Webpack build
      test: require.resolve('jquery'),
      use: [{
          loader: 'expose-loader',
          options: 'jQuery'
      }, {
          loader: 'expose-loader',
          options: '$'
      }]
  }
}

// configure Output
const configureOutput = () => {
  return {
    path: path.resolve(__dirname, `../${OUTPUT_DIR}`),
    filename: 'vendor/js/[name].[fullhash].js',
    chunkFilename: 'vendor/js/[name].[fullhash].js',
  }
}

// configure HtmlWebPackPlugin
const entryHtmlPlugins = config.map(({ site, share }) => {
  return new HtmlWebPackPlugin({
    filename: `${site}.html`,
    template: `./sources/templates/${site}.pug`,
    DATA: require(`../sources/data/${site}.json`),
    chunks: [site, share],
  })
})

module.exports = {
  entry: {
    index: {
      import: './sources/js/index.js',
      // dependOn: 'share'
    },
    // about: {
    //   import: './sources/js/about.js',
    //   dependOn: 'share'
    // },
    // contact: {
    //   import: './sources/js/contact.js'
    // },
    // share: './sources/js/module/share.js'
  },
  output: configureOutput(),
  resolve: configureResolveAlias(),
  module: {
    rules: [
      configureBabelLoader(),
      configurePugLoader(),
      configureFontsLoader(),
    ],
  },
  plugins: [
    configureJquery(),
    ...entryHtmlPlugins,
  ]
};