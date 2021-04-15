const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([withCSS, withSass, withImages, {
	exportPathMap: (
		defaultPathMap,
		{ dev, dir, outDir, distDir, buildId }
	) => { }
}]);