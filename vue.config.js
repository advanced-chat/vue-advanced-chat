module.exports = {
	chainWebpack: config => {
		config.externals({
			lamejs: 'lamejs'
		})
	}
}
