
var images = require('../controllers/images');
//var multer = require('multer');
//var storage = multer.memoryStorage();
//var upload = multer({ storage: storage});
var imagesRoute = function(app) {
  app.route('/images')
    .get(images.get);
  app.route('/images/dropzone').post(images.postToBlob);
  app.get('/images/custom/:width/:height', images.fetchImg, images.getCustom);
  app.get('/images/lotNumber/:lotNumber', images.getLotNumber);
  // app.get('/images/:saleNumber/banner', images.fetchImg, images.getBanner);
  // app.get('/images/:saleNumber/:lotNumber', images.fetchImg, images.getLotNumber);
};

module.exports = imagesRoute;
