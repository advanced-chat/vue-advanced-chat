import * as common from './common.js'
import GrInfo from './GrInfo.js'
var System = common.default.System
var VbrMode = common.default.VbrMode
var Float = common.default.Float
var ShortBlock = common.default.ShortBlock
var Util = common.default.Util
var Arrays = common.default.Arrays
var new_array_n = common.default.new_array_n
var new_byte = common.default.new_byte
var new_double = common.default.new_double
var new_float = common.default.new_float
var new_float_n = common.default.new_float_n
var new_int = common.default.new_int
var new_int_n = common.default.new_int_n
var assert = common.default.assert

function IIISideInfo() {
	this.tt = [
		[null, null],
		[null, null]
	]
	this.main_data_begin = 0
	this.private_bits = 0
	this.resvDrain_pre = 0
	this.resvDrain_post = 0
	this.scfsi = [new_int(4), new_int(4)]

	for (var gr = 0; gr < 2; gr++) {
		for (var ch = 0; ch < 2; ch++) {
			this.tt[gr][ch] = new GrInfo()
		}
	}
}

export default IIISideInfo
