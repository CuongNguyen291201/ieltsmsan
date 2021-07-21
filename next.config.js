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
		  {
			source: '/livegame/:any*',
			destination: '/livegame/',
		  },
		];
	  },
	exportPathMap: (
		defaultPathMap,
		{ dev, dir, outDir, distDir, buildId }
	) => { },
	env: {
		REACT_APP_ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
		REACT_APP_PREFIX: process.env.NEXT_PUBLIC_PREFIX
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	  }
}]);