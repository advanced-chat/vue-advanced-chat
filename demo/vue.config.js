module.exports = {
	lintOnSave: false,
	publicPath:
		process.env.NODE_ENV === 'production' ? '/vue-advanced-chat/' : '/',
	devServer: {
		open: true
	},

	chainWebpack: config => {
		config.resolve.alias.set('vue', '@vue/compat')

		config.module
			.rule('vue')
			.use('vue-loader')
			.tap(options => {
				return {
					...options,
					compilerOptions: {
						compatConfig: {
							MODE: 3
						}
					}
				}
			})
	}
}
