const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');


module.exports = withPlugins([withCSS, withSass, withImages, {
	async rewrites() {
		return [
		  {
			source: '/document/:any*',
			destination: '/document/',
		  },
		];
	  },
	exportPathMap: (
		defaultPathMap,
		{ dev, dir, outDir, distDir, buildId }
	) => ({
		'/khoa-hoc-cua-toi': { page: '/my-courses' }
	}),
	env: {
		REACT_APP_ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
		REACT_APP_PREFIX: process.env.NEXT_PUBLIC_PREFIX
	}
}]);