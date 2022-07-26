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

/**
 * ATH related stuff, if something new ATH related has to be added, please plug
 * it here into the ATH.
 */
function ATH() {
	/**
	 * Method for the auto adjustment.
	 */
	this.useAdjust = 0
	/**
	 * factor for tuning the (sample power) point below which adaptive threshold
	 * of hearing adjustment occurs
	 */
	this.aaSensitivityP = 0
	/**
	 * Lowering based on peak volume, 1 = no lowering.
	 */
	this.adjust = 0
	/**
	 * Limit for dynamic ATH adjust.
	 */
	this.adjustLimit = 0
	/**
	 * Determined to lower x dB each second.
	 */
	this.decay = 0
	/**
	 * Lowest ATH value.
	 */
	this.floor = 0
	/**
	 * ATH for sfbs in long blocks.
	 */
	this.l = new_float(Encoder.SBMAX_l)
	/**
	 * ATH for sfbs in short blocks.
	 */
	this.s = new_float(Encoder.SBMAX_s)
	/**
	 * ATH for partitioned sfb21 in long blocks.
	 */
	this.psfb21 = new_float(Encoder.PSFB21)
	/**
	 * ATH for partitioned sfb12 in short blocks.
	 */
	this.psfb12 = new_float(Encoder.PSFB12)
	/**
	 * ATH for long block convolution bands.
	 */
	this.cb_l = new_float(Encoder.CBANDS)
	/**
	 * ATH for short block convolution bands.
	 */
	this.cb_s = new_float(Encoder.CBANDS)
	/**
	 * Equal loudness weights (based on ATH).
	 */
	this.eql_w = new_float(Encoder.BLKSIZE / 2)
}

export default ATH
