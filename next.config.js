const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
});


module.exports = withPlugins([withBundleAnalyzer, withCSS, withSass, withImages, {
	async rewrites() {
		return [
		  {
			source: '/tai-lieu/:any*',
			destination: '/tai-lieu/',
		  }
		];
	  },
	exportPathMap: (
		defaultPathMap,
		{ dev, dir, outDir, distDir, buildId }
	) => { },
	env: {
		REACT_APP_ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
		REACT_APP_PREFIX: process.env.NEXT_PUBLIC_PREFIX,
		REACT_APP_FIREBASE_CONFIG: process.env.NEXT_PUBLIC_FIREBASE_CONFIG
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	  }
}]);