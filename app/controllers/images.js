var _ = require('lodash');
var Request = require('request');
// Request.debug = true;
var Jimp = require('jimp');
var toArray = require('stream-to-array');
var nconf = require('nconf');
var azure = require('azure-storage');
var client = require('pkgcloud').storage.createClient({
  provider: 'rackspace',
  username: 'hcannon',
  apiKey: '3fd74aa96d9209ecf2290aa529e6c465',
  region: 'ORD'
});
var acctName = nconf.get('AZURE_STORAGE_ACCOUNT');
var acctKey = nconf.get('AZURE_STORAGE_ACCESS_KEY');
var blobSvc = azure.createBlobService('lotsblob', 'NcLWxIFgLO2flnTqTDVJVCXcB5sjvJOLWs8wfXoO2+68RokLyCGo5/O1UvDkEG1KudjSrsyxG/uur2/VwrRN5A==');
var containerName = 'lots-test-3';

var optionsModel = require('../models/options');
var ImageModel = require('../models/image');
var imageTypes = [
  {
    type: "banner",
    sizes: [
      {
        "label" : "mobile",
        width: 1039
      },
      {
        "label" : "original",
        "width" : 2078
      }
    ]
  },
  {
    type: "auction"
  },
  {
    type: "lotDetails"
  },
  {
    type: ""
  }
];

var bannerType = _(imageTypes).find(function(item, i) {
  if (item.type === "banner") {
    return item;
  }
});

exports.getLotImage = function(req, res, next) {
  // read cache first //

  // no cache = magick time
  // make optionsModel from queries
  // var saleNumber = req.params.SaleNumber;
  // var lotNumber = req.params.lotNumber;
  var magick = new optionsModel(req.query);
  console.log('start!', req.params.lotNumber);
  console.time(req.params.lotNumber);
  Jimp.read('https://lotsblob.blob.core.windows.net/lots/uk040216/' + req.params.lotNumber + '.jpg').then(function(blob) {
    console.log('end: ', req.params.lotNumber);
    console.timeEnd(req.params.lotNumber);
    blob[magick.mode](magick.width, magick.height, magick.vAlign | magick.hAlign).getBuffer(Jimp.AUTO, function(err, resp){
      if (!err) {
        console.log('response! Jimp AUTO: ', Jimp.AUTO);
        res.setHeader('Content-Type', Jimp.AUTO);
        res.send(resp);
      } else {
        console.log('errr: ', err);
        res.status(500).send(err);
      }
    });
  }.bind(this)).catch(function(err) {
    console.log('Jimp read error: ', err);
    res.status(500).send('there was an error');
  });
};


exports.get = function (req, res) {
  // var images = [
  //   new ImageModel({
  //     src : '/images/lotimg',
  //     alt : 'uk01234'
  //   }),
  //   new ImageModel({
  //     src : '/images/lotimg',
  //     alt : 'uk01234'
  //   }),
  //   new ImageModel({
  //     src : '/images/lotimg',
  //     alt : 'uk01234'
  //   }),
  //   new ImageModel({
  //     src : '/images/lotimg',
  //     alt : 'uk01234'
  //   }),
  //   new ImageModel({
  //     src : '/images/lotimg',
  //     alt : 'uk01234'
  //   }),
  //   new ImageModel({
  //     src : '/images/lotimg',
  //     alt : 'uk01234'
  //   }),
  //   new ImageModel({
  //     src : '/images/lotimg',
  //     alt : 'uk01234'
  //   }),
  //   new ImageModel({
  //     src : '/images/lotimg',
  //     alt : 'uk01234'
  //   }),
  //   new ImageModel({
  //     src : '/images/lotimg',
  //     alt : 'uk01234'
  //   }),
  //   new ImageModel({
  //     src : '/images/lotimg',
  //     alt : 'uk01234'
  //   }),
  //   new ImageModel({
  //     src : '/images/lotimg',
  //     alt : 'ny01234'
  //   })
  // ];
  // res.render('images', {
  //   title: 'Images',
  //   images: images
  // });
  res.render('images');
};
exports.postToBlob = function (req, res) {
  var blobUrl, imgName;
  for(var i=29, len=30; i < len; i++){
    i = (i < 10) ? '0' + i.toString() : i.toString();
    blobUrl = 'uk040216/' + i + '.jpg';
    imgName = './app/assets/img/test3/1' + i + '_001.jpg';
    blobSvc.createBlockBlobFromLocalFile('lots', blobUrl, imgName,     function(err, result, resp) {
      if(!err) {
        console.log('file uploaded!', result);
        console.log('response: ', resp);
      } else {
        console.log('errrr: ', err);
      }
    });
    if (i + 1 === len) {
      res.send('file uploaded!');
    }
  }
};
