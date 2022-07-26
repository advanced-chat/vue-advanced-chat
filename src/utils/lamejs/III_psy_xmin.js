import Encoder from './Encoder.js'
import * as common from './common.js'
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

function III_psy_xmin() {
	this.l = new_float(Encoder.SBMAX_l)
	this.s = new_float_n([Encoder.SBMAX_s, 3])

	var self = this
	this.assign = function (iii_psy_xmin) {
		System.arraycopy(iii_psy_xmin.l, 0, self.l, 0, Encoder.SBMAX_l)
		for (var i = 0; i < Encoder.SBMAX_s; i++) {
			for (var j = 0; j < 3; j++) {
				self.s[i][j] = iii_psy_xmin.s[i][j]
			}
		}
	}
}

export default III_psy_xmin
