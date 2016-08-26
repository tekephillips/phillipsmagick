/**
 * Created by Tkim on 6/23/2016.
 */
function ImageModel(opts) {
  if(!opts) opts = {};
  this.src = opts.src || '';
  this.alt = opts.alt || '';
};

module.exports = ImageModel;