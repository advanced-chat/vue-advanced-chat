const path = require('path')

module.exports = {
	lintOnSave: false,
	publicPath:
		process.env.NODE_ENV === 'production' ? '/vue-advanced-chat/' : '/',
	devServer: {
		open: true
	},
	chainWebpack: config => {
		config.resolve.symlinks(false)
		config.resolve.alias.set('vue', path.resolve('./node_modules/vue'))
	}
}
