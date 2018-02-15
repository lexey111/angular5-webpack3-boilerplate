const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ngcWebpack = require('ngc-webpack');

export const config = {
	entry: {
		vendor: './src/vendor.ts',
		app: './src/index.ts'
	},
	target: 'web',
	output: {
		path: path.resolve('./dist'),
		publicPath: '.',
		filename: '[name].js',
		chunkFilename: '[id].js'
	},
	devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
	resolve: {
		extensions: ['.js', '.ts', '.html']
	},
	module: {
		rules: [
			{
				test: /.js$/,
				parser: {
					system: true
				}
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: '@ngtools/webpack'
			},
			// Templates
			{
				test: /\.html$/,
				exclude: /index.html$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'assets/templates/[name].[ext]'
						}
					}
				]
			},
			// .less files - components
			{
				test: /\.less$/,
				exclude: /app\.less$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'assets/templates/[name].css'
						}
					},
					{
						loader: 'less-loader',
					}
				]
			},
			// main application .less file
			{
				test: /app\.less$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'assets/[name].css'
						}

					},
					{
						loader: 'less-loader',
					}
				]
			}
		]
	},
	plugins: [
		new ngcWebpack.NgcWebpackPlugin({
			tsConfigPath: './tsconfig.json',
			mainPath: './src/index.ts'
		}),
		new ExtractTextPlugin('main.css'),
		new webpack.DefinePlugin({
			PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
			BUILDTIMESTAMP: JSON.stringify(Date.now()),
		}),
		new CopyWebpackPlugin([
			{
				from: './src/assets/images',
				to: './assets/images',
				toType: 'dir'
			},
			{
				from: './src/assets/shim',
				to: './assets',
				toType: 'dir'
			}
		]),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: `./src/index.html`,
			inject: true,
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
		}),

	],
};