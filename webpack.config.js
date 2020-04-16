const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const whitelister = require('purgecss-whitelister');
const glob = require('glob-all');
const path = require('path');

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
						hotReload: true
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
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
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
