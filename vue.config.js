module.exports = {
	chainWebpack: config => {
		config.externals({
			lamejs: 'lamejs'
		})
	},
	css: {
		extract: false
	}
}
