// package mp3;

/**
 * Layer III side information.
 *
 * @author Ken
 *
 */

import * as common from './common.js'
import Encoder from './Encoder.js'
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

function ScaleFac(arrL, arrS, arr21, arr12) {
	this.l = new_int(1 + Encoder.SBMAX_l)
	this.s = new_int(1 + Encoder.SBMAX_s)
	this.psfb21 = new_int(1 + Encoder.PSFB21)
	this.psfb12 = new_int(1 + Encoder.PSFB12)
	var l = this.l
	var s = this.s

	if (arguments.length == 4) {
		// public ScaleFac(final int[] arrL, final int[] arrS, final int[] arr21,
		//    final int[] arr12) {
		this.arrL = arguments[0]
		this.arrS = arguments[1]
		this.arr21 = arguments[2]
		this.arr12 = arguments[3]

		System.arraycopy(
			this.arrL,
			0,
			l,
			0,
			Math.min(this.arrL.length, this.l.length)
		)
		System.arraycopy(
			this.arrS,
			0,
			s,
			0,
			Math.min(this.arrS.length, this.s.length)
		)
		System.arraycopy(
			this.arr21,
			0,
			this.psfb21,
			0,
			Math.min(this.arr21.length, this.psfb21.length)
		)
		System.arraycopy(
			this.arr12,
			0,
			this.psfb12,
			0,
			Math.min(this.arr12.length, this.psfb12.length)
		)
	}
}

export default ScaleFac
