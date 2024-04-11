import * as common from './common.js'
import NewMDCT from './NewMDCT.js'
import III_psy_ratio from './III_psy_ratio.js'
import MPEGMode from './MPEGMode.js'
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
 * ENCDELAY The encoder delay.
 *
 * Minimum allowed is MDCTDELAY (see below)
 *
 * The first 96 samples will be attenuated, so using a value less than 96
 * will result in corrupt data for the first 96-ENCDELAY samples.
 *
 * suggested: 576 set to 1160 to sync with FhG.
 */
Encoder.ENCDELAY = 576
/**
 * make sure there is at least one complete frame after the last frame
 * containing real data
 *
 * Using a value of 288 would be sufficient for a a very sophisticated
 * decoder that can decode granule-by-granule instead of frame by frame. But
 * lets not assume this, and assume the decoder will not decode frame N
 * unless it also has data for frame N+1
 */
Encoder.POSTDELAY = 1152

/**
 * delay of the MDCT used in mdct.c original ISO routines had a delay of
 * 528! Takehiro's routines:
 */
Encoder.MDCTDELAY = 48
Encoder.FFTOFFSET = 224 + Encoder.MDCTDELAY

/**
 * Most decoders, including the one we use, have a delay of 528 samples.
 */
Encoder.DECDELAY = 528

/**
 * number of subbands
 */
Encoder.SBLIMIT = 32

/**
 * parition bands bands
 */
Encoder.CBANDS = 64

/**
 * number of critical bands/scale factor bands where masking is computed
 */
Encoder.SBPSY_l = 21
Encoder.SBPSY_s = 12

/**
 * total number of scalefactor bands encoded
 */
Encoder.SBMAX_l = 22
Encoder.SBMAX_s = 13
Encoder.PSFB21 = 6
Encoder.PSFB12 = 6

/**
 * FFT sizes
 */
Encoder.BLKSIZE = 1024
Encoder.HBLKSIZE = Encoder.BLKSIZE / 2 + 1
Encoder.BLKSIZE_s = 256
Encoder.HBLKSIZE_s = Encoder.BLKSIZE_s / 2 + 1

Encoder.NORM_TYPE = 0
Encoder.START_TYPE = 1
Encoder.SHORT_TYPE = 2
Encoder.STOP_TYPE = 3

/**
 * <PRE>
 * Mode Extention:
 * When we are in stereo mode, there are 4 possible methods to store these
 * two channels. The stereo modes -m? are using a subset of them.
 *
 *  -ms: MPG_MD_LR_LR
 *  -mj: MPG_MD_LR_LR and MPG_MD_MS_LR
 *  -mf: MPG_MD_MS_LR
 *  -mi: all
 * </PRE>
 */
Encoder.MPG_MD_LR_LR = 0
Encoder.MPG_MD_LR_I = 1
Encoder.MPG_MD_MS_LR = 2
Encoder.MPG_MD_MS_I = 3

Encoder.fircoef = [
  -0.0207887 * 5,
  -0.0378413 * 5,
  -0.0432472 * 5,
  -0.031183 * 5,
  7.79609e-18 * 5,
  0.0467745 * 5,
  0.10091 * 5,
  0.151365 * 5,
  0.187098 * 5
]

function Encoder() {
  var FFTOFFSET = Encoder.FFTOFFSET
  var MPG_MD_MS_LR = Encoder.MPG_MD_MS_LR
  // BitStream bs;
  // PsyModel psy;
  // VBRTag vbr;
  // QuantizePVT qupvt;
  var bs = null
  this.psy = null
  var psy = null
  var vbr = null
  var qupvt = null

  // public final void setModules(BitStream bs, PsyModel psy, QuantizePVT qupvt,
  //    VBRTag vbr) {
  this.setModules = function (_bs, _psy, _qupvt, _vbr) {
    bs = _bs
    this.psy = _psy
    psy = _psy
    vbr = _vbr
    qupvt = _qupvt
  }

  var newMDCT = new NewMDCT()

  /***********************************************************************
   *
   * encoder and decoder delays
   *
   ***********************************************************************/

  /**
   * <PRE>
   * layer III enc->dec delay:  1056 (1057?)   (observed)
   * layer  II enc->dec delay:   480  (481?)   (observed)
   *
   * polyphase 256-16             (dec or enc)        = 240
   * mdct      256+32  (9*32)     (dec or enc)        = 288
   * total:    512+16
   *
   * My guess is that delay of polyphase filterbank is actualy 240.5
   * (there are technical reasons for this, see postings in mp3encoder).
   * So total Encode+Decode delay = ENCDELAY + 528 + 1
   * </PRE>
   */

  /**
   * auto-adjust of ATH, useful for low volume Gabriel Bouvigne 3 feb 2001
   *
   * modifies some values in gfp.internal_flags.ATH (gfc.ATH)
   */
  // private void adjust_ATH(final LameInternalFlags gfc) {
  function adjust_ATH(gfc) {
    var gr2_max, max_pow

    if (gfc.ATH.useAdjust == 0) {
      gfc.ATH.adjust = 1.0
      /* no adjustment */
      return
    }

    /* jd - 2001 mar 12, 27, jun 30 */
    /* loudness based on equal loudness curve; */
    /* use granule with maximum combined loudness */
    max_pow = gfc.loudness_sq[0][0]
    gr2_max = gfc.loudness_sq[1][0]
    if (gfc.channels_out == 2) {
      max_pow += gfc.loudness_sq[0][1]
      gr2_max += gfc.loudness_sq[1][1]
    } else {
      max_pow += max_pow
      gr2_max += gr2_max
    }
    if (gfc.mode_gr == 2) {
      max_pow = Math.max(max_pow, gr2_max)
    }
    max_pow *= 0.5
    /* max_pow approaches 1.0 for full band noise */

    /* jd - 2001 mar 31, jun 30 */
    /* user tuning of ATH adjustment region */
    max_pow *= gfc.ATH.aaSensitivityP

    /*
     * adjust ATH depending on range of maximum value
     */

    /* jd - 2001 feb27, mar12,20, jun30, jul22 */
    /* continuous curves based on approximation */
    /* to GB's original values. */
    /* For an increase in approximate loudness, */
    /* set ATH adjust to adjust_limit immediately */
    /* after a delay of one frame. */
    /* For a loudness decrease, reduce ATH adjust */
    /* towards adjust_limit gradually. */
    /* max_pow is a loudness squared or a power. */
    if (max_pow > 0.03125) {
      /* ((1 - 0.000625)/ 31.98) from curve below */
      if (gfc.ATH.adjust >= 1.0) {
        gfc.ATH.adjust = 1.0
      } else {
        /* preceding frame has lower ATH adjust; */
        /* ascend only to the preceding adjust_limit */
        /* in case there is leading low volume */
        if (gfc.ATH.adjust < gfc.ATH.adjustLimit) {
          gfc.ATH.adjust = gfc.ATH.adjustLimit
        }
      }
      gfc.ATH.adjustLimit = 1.0
    } else {
      /* adjustment curve */
      /* about 32 dB maximum adjust (0.000625) */
      var adj_lim_new = 31.98 * max_pow + 0.000625
      if (gfc.ATH.adjust >= adj_lim_new) {
        /* descend gradually */
        gfc.ATH.adjust *= adj_lim_new * 0.075 + 0.925
        if (gfc.ATH.adjust < adj_lim_new) {
          /* stop descent */
          gfc.ATH.adjust = adj_lim_new
        }
      } else {
        /* ascend */
        if (gfc.ATH.adjustLimit >= adj_lim_new) {
          gfc.ATH.adjust = adj_lim_new
        } else {
          /* preceding frame has lower ATH adjust; */
          /* ascend only to the preceding adjust_limit */
          if (gfc.ATH.adjust < gfc.ATH.adjustLimit) {
            gfc.ATH.adjust = gfc.ATH.adjustLimit
          }
        }
      }
      gfc.ATH.adjustLimit = adj_lim_new
    }
  }

  /**
   * <PRE>
   *  some simple statistics
   *
   *  bitrate index 0: free bitrate . not allowed in VBR mode
   *  : bitrates, kbps depending on MPEG version
   *  bitrate index 15: forbidden
   *
   *  mode_ext:
   *  0:  LR
   *  1:  LR-i
   *  2:  MS
   *  3:  MS-i
   * </PRE>
   */
  function updateStats(gfc) {
    var gr, ch
    assert(gfc.bitrate_index >= 0 && gfc.bitrate_index < 16)
    assert(gfc.mode_ext >= 0 && gfc.mode_ext < 4)

    /* count bitrate indices */
    gfc.bitrate_stereoMode_Hist[gfc.bitrate_index][4]++
    gfc.bitrate_stereoMode_Hist[15][4]++

    /* count 'em for every mode extension in case of 2 channel encoding */
    if (gfc.channels_out == 2) {
      gfc.bitrate_stereoMode_Hist[gfc.bitrate_index][gfc.mode_ext]++
      gfc.bitrate_stereoMode_Hist[15][gfc.mode_ext]++
    }
    for (gr = 0; gr < gfc.mode_gr; ++gr) {
      for (ch = 0; ch < gfc.channels_out; ++ch) {
        var bt = gfc.l3_side.tt[gr][ch].block_type | 0
        if (gfc.l3_side.tt[gr][ch].mixed_block_flag != 0) bt = 4
        gfc.bitrate_blockType_Hist[gfc.bitrate_index][bt]++
        gfc.bitrate_blockType_Hist[gfc.bitrate_index][5]++
        gfc.bitrate_blockType_Hist[15][bt]++
        gfc.bitrate_blockType_Hist[15][5]++
      }
    }
  }

  function lame_encode_frame_init(gfp, inbuf) {
    var gfc = gfp.internal_flags

    var ch, gr

    if (gfc.lame_encode_frame_init == 0) {
      /* prime the MDCT/polyphase filterbank with a short block */
      var i, j
      var primebuff0 = new_float(286 + 1152 + 576)
      var primebuff1 = new_float(286 + 1152 + 576)
      gfc.lame_encode_frame_init = 1
      for (i = 0, j = 0; i < 286 + 576 * (1 + gfc.mode_gr); ++i) {
        if (i < 576 * gfc.mode_gr) {
          primebuff0[i] = 0
          if (gfc.channels_out == 2) primebuff1[i] = 0
        } else {
          primebuff0[i] = inbuf[0][j]
          if (gfc.channels_out == 2) primebuff1[i] = inbuf[1][j]
          ++j
        }
      }
      /* polyphase filtering / mdct */
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          gfc.l3_side.tt[gr][ch].block_type = Encoder.SHORT_TYPE
        }
      }
      newMDCT.mdct_sub48(gfc, primebuff0, primebuff1)

      /* check FFT will not use a negative starting offset */
      assert(Encoder.FFTOFFSET <= 576)
      /* check if we have enough data for FFT */
      assert(gfc.mf_size >= Encoder.BLKSIZE + gfp.framesize - Encoder.FFTOFFSET)
      /* check if we have enough data for polyphase filterbank */
      assert(gfc.mf_size >= 512 + gfp.framesize - 32)
    }
  }

  /**
   * <PRE>
   * encodeframe()           Layer 3
   *
   * encode a single frame
   *
   *
   *    lame_encode_frame()
   *
   *
   *                           gr 0            gr 1
   *    inbuf:           |--------------|--------------|--------------|
   *
   *
   *    Polyphase (18 windows, each shifted 32)
   *    gr 0:
   *    window1          <----512---.
   *    window18                 <----512---.
   *
   *    gr 1:
   *    window1                         <----512---.
   *    window18                                <----512---.
   *
   *
   *
   *    MDCT output:  |--------------|--------------|--------------|
   *
   *    FFT's                    <---------1024---------.
   *                                             <---------1024-------.
   *
   *
   *
   *        inbuf = buffer of PCM data size=MP3 framesize
   *        encoder acts on inbuf[ch][0], but output is delayed by MDCTDELAY
   *        so the MDCT coefficints are from inbuf[ch][-MDCTDELAY]
   *
   *        psy-model FFT has a 1 granule delay, so we feed it data for the
   *        next granule.
   *        FFT is centered over granule:  224+576+224
   *        So FFT starts at:   576-224-MDCTDELAY
   *
   *        MPEG2:  FFT ends at:  BLKSIZE+576-224-MDCTDELAY      (1328)
   *        MPEG1:  FFT ends at:  BLKSIZE+2*576-224-MDCTDELAY    (1904)
   *
   *        MPEG2:  polyphase first window:  [0..511]
   *                          18th window:   [544..1055]          (1056)
   *        MPEG1:            36th window:   [1120..1631]         (1632)
   *                data needed:  512+framesize-32
   *
   *        A close look newmdct.c shows that the polyphase filterbank
   *        only uses data from [0..510] for each window.  Perhaps because the window
   *        used by the filterbank is zero for the last point, so Takehiro's
   *        code doesn't bother to compute with it.
   *
   *        FFT starts at 576-224-MDCTDELAY (304)  = 576-FFTOFFSET
   *
   * </PRE>
   */

  this.lame_encode_mp3_frame = function (
    gfp,
    inbuf_l,
    inbuf_r,
    mp3buf,
    mp3bufPos,
    mp3buf_size
  ) {
    var mp3count
    var masking_LR = new_array_n([2, 2])
    /*
     * LR masking &
     * energy
     */
    masking_LR[0][0] = new III_psy_ratio()
    masking_LR[0][1] = new III_psy_ratio()
    masking_LR[1][0] = new III_psy_ratio()
    masking_LR[1][1] = new III_psy_ratio()
    var masking_MS = new_array_n([2, 2])
    /* MS masking & energy */
    masking_MS[0][0] = new III_psy_ratio()
    masking_MS[0][1] = new III_psy_ratio()
    masking_MS[1][0] = new III_psy_ratio()
    masking_MS[1][1] = new III_psy_ratio()
    // III_psy_ratio masking[][];
    var masking
    /* pointer to selected maskings */
    var inbuf = [null, null]
    var gfc = gfp.internal_flags

    var tot_ener = new_float_n([2, 4])
    var ms_ener_ratio = [0.5, 0.5]
    var pe = [
      [0, 0],
      [0, 0]
    ]
    var pe_MS = [
      [0, 0],
      [0, 0]
    ]

    // float[][] pe_use;
    var pe_use

    var ch, gr

    inbuf[0] = inbuf_l
    inbuf[1] = inbuf_r

    if (gfc.lame_encode_frame_init == 0) {
      /* first run? */
      lame_encode_frame_init(gfp, inbuf)
    }

    /** ******************** padding *****************************/
    /**
     * <PRE>
     * padding method as described in
     * "MPEG-Layer3 / Bitstream Syntax and Decoding"
     * by Martin Sieler, Ralph Sperschneider
     *
     * note: there is no padding for the very first frame
     *
     * Robert Hegemann 2000-06-22
     * </PRE>
     */
    gfc.padding = 0
    if ((gfc.slot_lag -= gfc.frac_SpF) < 0) {
      gfc.slot_lag += gfp.out_samplerate
      gfc.padding = 1
    }

    /****************************************
     * Stage 1: psychoacoustic model *
     ****************************************/

    if (gfc.psymodel != 0) {
      /*
       * psychoacoustic model psy model has a 1 granule (576) delay that
       * we must compensate for (mt 6/99).
       */
      var ret
      var bufp = [null, null]
      /* address of beginning of left & right granule */
      var bufpPos = 0
      /* address of beginning of left & right granule */
      var blocktype = new_int(2)

      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          bufp[ch] = inbuf[ch]
          bufpPos = 576 + gr * 576 - Encoder.FFTOFFSET
        }
        if (gfp.VBR == VbrMode.vbr_mtrh || gfp.VBR == VbrMode.vbr_mt) {
          ret = psy.L3psycho_anal_vbr(
            gfp,
            bufp,
            bufpPos,
            gr,
            masking_LR,
            masking_MS,
            pe[gr],
            pe_MS[gr],
            tot_ener[gr],
            blocktype
          )
        } else {
          ret = psy.L3psycho_anal_ns(
            gfp,
            bufp,
            bufpPos,
            gr,
            masking_LR,
            masking_MS,
            pe[gr],
            pe_MS[gr],
            tot_ener[gr],
            blocktype
          )
        }
        if (ret != 0) return -4

        if (gfp.mode == MPEGMode.JOINT_STEREO) {
          ms_ener_ratio[gr] = tot_ener[gr][2] + tot_ener[gr][3]
          if (ms_ener_ratio[gr] > 0) { ms_ener_ratio[gr] = tot_ener[gr][3] / ms_ener_ratio[gr] }
        }

        /* block type flags */
        for (ch = 0; ch < gfc.channels_out; ch++) {
          var cod_info = gfc.l3_side.tt[gr][ch]
          cod_info.block_type = blocktype[ch]
          cod_info.mixed_block_flag = 0
        }
      }
    } else {
      /* no psy model */
      for (gr = 0; gr < gfc.mode_gr; gr++) {
 for (ch = 0; ch < gfc.channels_out; ch++) {
          gfc.l3_side.tt[gr][ch].block_type = Encoder.NORM_TYPE
          gfc.l3_side.tt[gr][ch].mixed_block_flag = 0
          pe_MS[gr][ch] = pe[gr][ch] = 700
        }
}
    }

    /* auto-adjust of ATH, useful for low volume */
    adjust_ATH(gfc)

    /****************************************
     * Stage 2: MDCT *
     ****************************************/

    /* polyphase filtering / mdct */
    newMDCT.mdct_sub48(gfc, inbuf[0], inbuf[1])

    /****************************************
     * Stage 3: MS/LR decision *
     ****************************************/

    /* Here will be selected MS or LR coding of the 2 stereo channels */
    gfc.mode_ext = Encoder.MPG_MD_LR_LR

    if (gfp.force_ms) {
      gfc.mode_ext = Encoder.MPG_MD_MS_LR
    } else if (gfp.mode == MPEGMode.JOINT_STEREO) {
      /*
       * ms_ratio = is scaled, for historical reasons, to look like a
       * ratio of side_channel / total. 0 = signal is 100% mono .5 = L & R
       * uncorrelated
       */

      /**
       * <PRE>
       * [0] and [1] are the results for the two granules in MPEG-1,
       * in MPEG-2 it's only a faked averaging of the same value
       * _prev is the value of the last granule of the previous frame
       * _next is the value of the first granule of the next frame
       * </PRE>
       */

      var sum_pe_MS = 0
      var sum_pe_LR = 0
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          sum_pe_MS += pe_MS[gr][ch]
          sum_pe_LR += pe[gr][ch]
        }
      }

      /* based on PE: M/S coding would not use much more bits than L/R */
      if (sum_pe_MS <= 1.0 * sum_pe_LR) {
        var gi0 = gfc.l3_side.tt[0]
        var gi1 = gfc.l3_side.tt[gfc.mode_gr - 1]

        if (
          gi0[0].block_type == gi0[1].block_type &&
          gi1[0].block_type == gi1[1].block_type
        ) {
          gfc.mode_ext = Encoder.MPG_MD_MS_LR
        }
      }
    }

    /* bit and noise allocation */
    if (gfc.mode_ext == MPG_MD_MS_LR) {
      masking = masking_MS
      /* use MS masking */
      pe_use = pe_MS
    } else {
      masking = masking_LR
      /* use LR masking */
      pe_use = pe
    }

    /* copy data for MP3 frame analyzer */
    if (gfp.analysis && gfc.pinfo != null) {
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          gfc.pinfo.ms_ratio[gr] = gfc.ms_ratio[gr]
          gfc.pinfo.ms_ener_ratio[gr] = ms_ener_ratio[gr]
          gfc.pinfo.blocktype[gr][ch] = gfc.l3_side.tt[gr][ch].block_type
          gfc.pinfo.pe[gr][ch] = pe_use[gr][ch]
          System.arraycopy(
            gfc.l3_side.tt[gr][ch].xr,
            0,
            gfc.pinfo.xr[gr][ch],
            0,
            576
          )
          /*
           * in psymodel, LR and MS data was stored in pinfo. switch
           * to MS data:
           */
          if (gfc.mode_ext == MPG_MD_MS_LR) {
            gfc.pinfo.ers[gr][ch] = gfc.pinfo.ers[gr][ch + 2]
            System.arraycopy(
              gfc.pinfo.energy[gr][ch + 2],
              0,
              gfc.pinfo.energy[gr][ch],
              0,
              gfc.pinfo.energy[gr][ch].length
            )
          }
        }
      }
    }

    /****************************************
     * Stage 4: quantization loop *
     ****************************************/

    if (gfp.VBR == VbrMode.vbr_off || gfp.VBR == VbrMode.vbr_abr) {
      var i
      var f

      for (i = 0; i < 18; i++) gfc.nsPsy.pefirbuf[i] = gfc.nsPsy.pefirbuf[i + 1]

      f = 0.0
      for (gr = 0; gr < gfc.mode_gr; gr++) { for (ch = 0; ch < gfc.channels_out; ch++) f += pe_use[gr][ch] }
      gfc.nsPsy.pefirbuf[18] = f

      f = gfc.nsPsy.pefirbuf[9]
      for (i = 0; i < 9; i++) {
 f +=
          (gfc.nsPsy.pefirbuf[i] + gfc.nsPsy.pefirbuf[18 - i]) *
          Encoder.fircoef[i]
}

      f = (670 * 5 * gfc.mode_gr * gfc.channels_out) / f
      for (gr = 0; gr < gfc.mode_gr; gr++) {
        for (ch = 0; ch < gfc.channels_out; ch++) {
          pe_use[gr][ch] *= f
        }
      }
    }
    gfc.iteration_loop.iteration_loop(gfp, pe_use, ms_ener_ratio, masking)

    /****************************************
     * Stage 5: bitstream formatting *
     ****************************************/

    /* write the frame to the bitstream */
    bs.format_bitstream(gfp)

    /* copy mp3 bit buffer into array */
    mp3count = bs.copy_buffer(gfc, mp3buf, mp3bufPos, mp3buf_size, 1)

    if (gfp.bWriteVbrTag) vbr.addVbrFrame(gfp)

    if (gfp.analysis && gfc.pinfo != null) {
      for (ch = 0; ch < gfc.channels_out; ch++) {
        var j
        for (j = 0; j < FFTOFFSET; j++) { gfc.pinfo.pcmdata[ch][j] = gfc.pinfo.pcmdata[ch][j + gfp.framesize] }
        for (j = FFTOFFSET; j < 1600; j++) {
          gfc.pinfo.pcmdata[ch][j] = inbuf[ch][j - FFTOFFSET]
        }
      }
      qupvt.set_frame_pinfo(gfp, masking)
    }

    updateStats(gfc)

    return mp3count
  }
}

export default Encoder
