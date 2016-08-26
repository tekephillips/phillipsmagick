var Jimp = require('jimp');
var _ = require('lodash');

function optionsModel(opts) {
  if (!opts) opts = {};
  this.getNum = function(num) {
    var val;
    val = (!isNaN(parseInt(num, 10))) ? parseInt(num, 10) : 1;
    return val;
  };
  this.getVAlign = function(str) {
    var vAlign = {
      'top' : Jimp.VERTICAL_ALIGN_TOP,
      'middle' : Jimp.VERTICAL_ALIGN_MIDDLE,
      'bottom' : Jimp.VERTICAL_ALIGN_BOTTOM,
    };
    var val;
    (_.has(vAlign, str)) ?  val = vAlign[str] : val = Jimp.VERTICAL_ALIGN_TOP;
    return val;
  };
  this.getHAlign = function(str){
    var hAlign = {
      'left' : Jimp.HORIZONTAL_ALIGN_LEFT,
      'center' : Jimp.HORIZONTAL_ALIGN_CENTER,
      'right' : Jimp.HORIZONTAL_ALIGN_RIGHT
    };
    var val;

    (_.has(hAlign, str)) ?  val = hAlign[str] : val = Jimp.HORIZONTAL_ALIGN_LEFT;
    return val;
  };
  var height = _.isUndefined(opts.h) ? Jimp.AUTO : opts.h;
  this.width = this.getNum(opts.w),
  this.height = this.getNum(height),
  // this.Align = this.getAlign(opts.align),
    this.vAlign = this.getVAlign(opts.va),
  this.hAlign = this.getHAlign(opts.ha),
  this.mode = (opts.m.toLowerCase() === 'contain' || opts.m.toLowerCase() === 'cover') ? opts.m : 'contain';

  return this;
};

module.exports = optionsModel;
