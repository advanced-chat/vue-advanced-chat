var isChromium = window.chrome
var winNav = window.navigator
var vendorName = winNav.vendor
var isOpera = typeof window.opr !== 'undefined'
var isIEedge = winNav.userAgent.indexOf('Edg') > -1
var isIOSChrome = winNav.userAgent.match('CriOS')

export function detectChrome() {
	if (isIOSChrome) {
		return true
	} else if (
		isChromium !== null &&
		typeof isChromium !== 'undefined' &&
		vendorName === 'Google Inc.' &&
		isOpera === false &&
		isIEedge === false
	) {
		return true
	} else {
		return false
	}
}
