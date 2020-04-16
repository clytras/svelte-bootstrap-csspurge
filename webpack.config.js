const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const Dotenv = require('dotenv-webpack');
const whitelister = require('purgecss-whitelister');
const glob = require('glob-all');
const path = require('path');
const { scss } = require('svelte-preprocess');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const PATHS = {
  src: path.join(__dirname, 'src')
}

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
  },
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false
          }
        },
      }),
      new TerserPlugin(),
    ],
  },
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
            hotReload: true,
            preprocess: require('svelte-preprocess')([scss()]),
					}
				}
			},
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		/**
			// 		 * MiniCssExtractPlugin doesn't support HMR.
			// 		 * For developing, use 'style-loader' instead.
			// 		 * */
			// 		prod ? MiniCssExtractPlugin.loader : 'style-loader',
			// 		'css-loader'
			// 	]
      // },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [{
            loader: prod ? MiniCssExtractPlugin.loader : 'style-loader', // inject CSS to page
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS modules
          },
          {
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: function() {
                // post css plugins, can be exported to postcss.config.js
                return [require('precss'), require('autoprefixer')];
              },
            },
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
        ],
      },
		]
	},
	mode,
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      minify: prod ?
        {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        } :
        false,
      template: 'index.html',
      inlineSource: '.(js|css)$', // embed all javascript and css inline
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
    new PurgecssPlugin({
      // keyframes: false,
      // paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, {
        nodir: true
      }),
      // whitelist: whitelister('bootstrap/dist/css/bootstrap.css')
    }),
	],
	devtool: prod ? false: 'source-map'
};
