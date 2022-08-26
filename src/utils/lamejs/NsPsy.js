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

// package mp3;

/**
 * Variables used for --nspsytune
 *
 * @author Ken
 *
 */
function NsPsy() {
	this.last_en_subshort = new_float_n([4, 9])
	this.lastAttacks = new_int(4)
	this.pefirbuf = new_float(19)
	this.longfact = new_float(Encoder.SBMAX_l)
	this.shortfact = new_float(Encoder.SBMAX_s)

	/**
	 * short block tuning
	 */
	this.attackthre = 0
	this.attackthre_s = 0
}

export default NsPsy
