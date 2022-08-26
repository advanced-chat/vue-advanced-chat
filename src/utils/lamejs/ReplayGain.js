import * as common from './common.js'
import * as GainAnalysis from './GainAnalysis.js'
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

function ReplayGain() {
	this.linprebuf = new_float(GainAnalysis.MAX_ORDER * 2)
	/**
	 * left input samples, with pre-buffer
	 */
	this.linpre = 0
	this.lstepbuf = new_float(
		GainAnalysis.MAX_SAMPLES_PER_WINDOW + GainAnalysis.MAX_ORDER
	)
	/**
	 * left "first step" (i.e. post first filter) samples
	 */
	this.lstep = 0
	this.loutbuf = new_float(
		GainAnalysis.MAX_SAMPLES_PER_WINDOW + GainAnalysis.MAX_ORDER
	)
	/**
	 * left "out" (i.e. post second filter) samples
	 */
	this.lout = 0
	this.rinprebuf = new_float(GainAnalysis.MAX_ORDER * 2)
	/**
	 * right input samples ...
	 */
	this.rinpre = 0
	this.rstepbuf = new_float(
		GainAnalysis.MAX_SAMPLES_PER_WINDOW + GainAnalysis.MAX_ORDER
	)
	this.rstep = 0
	this.routbuf = new_float(
		GainAnalysis.MAX_SAMPLES_PER_WINDOW + GainAnalysis.MAX_ORDER
	)
	this.rout = 0
	/**
	 * number of samples required to reach number of milliseconds required
	 * for RMS window
	 */
	this.sampleWindow = 0
	this.totsamp = 0
	this.lsum = 0
	this.rsum = 0
	this.freqindex = 0
	this.first = 0
	this.A = new_int(0 | (GainAnalysis.STEPS_per_dB * GainAnalysis.MAX_dB))
	this.B = new_int(0 | (GainAnalysis.STEPS_per_dB * GainAnalysis.MAX_dB))
}

export default ReplayGain
