const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

module.exports = withSass(withImages({
	exportPathMap: (
		defaultPathMap,
		{ dev, dir, outDir, distDir, buildId }
	) => { },
}));