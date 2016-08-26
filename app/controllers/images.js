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
// res.setHeader('Content-Type', 'image/jpeg');
// console.log('getLotNumber');
// toArray(req.imgStream)
//   .then(function (parts) {
//     var buffers = [];
//     for (var i = 0, l = parts.length; i < l; ++i) {
//       var part = parts[i];
//       buffers.push((part instanceof Buffer) ? part : new Buffer(part))
//     }
//     lwip.open(Buffer.concat(buffers), 'jpg', function (err, image) {
//       console.log('lwip open');
//       if (err) {
//         console.log('lwip open: ', err);
//         return err;
//       }
//       image.batch()
//         .contain(220, 281, 'white')
//         .toBuffer('jpg', function (err, buffer) {
//           if (err) {
//             console.log('lwip toBuffer: ', err);
//             return err;
//           }
//           req.imgBuffer = buffer;
//           res.send(req.imgBuffer);
//         });
//     });
//   })
//   .catch(
//     function(err) {
//       console.log('toArray err: ', err);
//       res.send('error');
//     });
exports.getBanner = function(req, res, next) {
  console.log('getBanner');
  toArray(req.imgStream)
    .then(function (parts) {
      var buffers = [];
      for (var i = 0, l = parts.length; i < l; ++i) {
        var part = parts[i];
        buffers.push((part instanceof Buffer) ? part : new Buffer(part))
      }
      res.setHeader('Content-Type', 'image/jpeg');
      req.imgBuffer = Buffer.concat(buffers);
      res.send(req.imgBuffer);
    })
    .catch(
      function(err) {
        console.log('toArray err: ', err);
        res.send('error');
      });
};
exports.getLotNumber = function(req, res, next) {
  // read cache first //

  // no cache = magick time
  // make optionsModel from queries
  // var saleNumber = req.params.SaleNumber;
  // var lotNumber = req.params.lotNumber;
  var magick = new optionsModel(req.query);
  console.log('start!', req.params.lotNumber);
  console.time(req.params.lotNumber);
  setTimeout(function() {
    console.timeEnd(req.params.lotNumber);
    res.send('hello');
  }, 3000);
  // Jimp.read('https://lotsblob.blob.core.windows.net/lots/uk040216/' + req.params.lotNumber + '.jpg').then(function(blob) {
  //   console.log('end: ', req.params.lotNumber);
  //   console.timeEnd(req.params.lotNumber);
  //   // console.log('typeof ?: ', blob[magick.mode](magick.width, magick.height, magick.vAlign));
  //   // blob.contain(100, 200, Jimp.VERTICDAL_ALIGN | Jimp.HORIZONTAL);
  //   // var blobFirstAl = blob[magick.mode](magick.width, magick.height, magick.vAlign);
  //   // blobFirstAl.contain(100, 200, Jimp.HorizontalAlign);
  //   blob[magick.mode](magick.width, magick.height, magick.vAlign | magick.hAlign).getBuffer(Jimp.AUTO, function(err, resp){
  //     if (!err) {
  //       console.log('response! Jimp AUTO: ', Jimp.AUTO);
  //       res.setHeader('Content-Type', Jimp.AUTO);
  //       res.send(resp);
  //     } else {
  //       console.log('errr: ', err);
  //       res.status(500).send(err);
  //     }
  //   });
  // }.bind(this)).catch(function(err) {
  //   console.log('Jimp read error: ', err);
  //   res.status(500).send('there was an error');
  // });
};
exports.fetchImg = function (req, res, next) {
  var imgName = (req.params.lotNumber) ? req.params.lotNumber + '_001.jpg' : 'NY040216.jpg';
  var containerName = 'test';
  req.imgStream = new stream.Readable();
  req.imgStream.data = [];
  req.imgStream._read = function(chunk) {
    console.log('read: ', chunk);
    this.data.push(chunk);
  };
  req.imgStream.on('data', function(chunk) {
    console.log('on data', chunk.length);
  });
  // client.download({
  //   container: 'CMSContentTest',
  //   remote: '/salebanner/NY040216/' + imgName
  // }, function(err) {
  //   if (err) {
  //     console.log('fetchImg err: ', err);
  //     res.send(err);
  //   }})
  client.download({
    container: 'CMSContentTest',
    remote: '/salebanner/NY040216/' + imgName
  }, function(err) {
    if (err) {
      console.log('fetchImg err: ', err);
      res.send(err);
    }}).pipe(req.imgStream);

  next();
};
exports.processImg = function(req, res, next) {
  console.log('processImg', req.imgStream);
  toArray(req.imgStream)
    .then(function (parts) {
      var buffers = [];
      for (var i = 0, l = parts.length; i < l; ++i) {
        var part = parts[i];
        buffers.push((part instanceof Buffer) ? part : new Buffer(part))
      }
      console.log('toArray');
      if (!req.params.lotNumber) {
        console.log('not lotNumber');
        req.imgBuffer = Buffer.concat(buffers);
        next();
      } else {
        lwip.open(Buffer.concat(buffers), 'jpg', function (err, image) {
          console.log('lwip open');
          if (err) {
            console.log('lwip open: ', err);
            return err;
          }
          image.batch()
            .resize(220, 281)
            .toBuffer('jpg', function (err, buffer) {
              if (err) {
                console.log('lwip toBuffer: ', err);
                return err;
              }
              req.imgBuffer = buffer;
              next();
            });
        });
      }
      //lwip.open(Buffer.concat(buffers), 'jpg', function (err, image) {
      //  console.log('lwip open');
      //  if (err) {
      //    console.log('lwip open: ', err);
      //    return err;
      //  }
      //  image.batch()
      //    .resize(220, 281)
      //    .toBuffer('jpg', function (err, buffer) {
      //      if (err) {
      //        console.log('lwip toBuffer: ', err);
      //        return err;
      //      }
      //      req.imgBuffer = buffer;
      //      next();
      //    });
      //  //image.scale(0.25, function (err, img) {
      //  //  if (err) {
      //  //    console.log('lwip scale: ', err);
      //  //    return err;
      //  //  }
      //  //  img.toBuffer('jpg', function (err, buffer) {
      //  //    if (err) {
      //  //      console.log('lwip toBuffer: ', err);
      //  //
      //  //      return err;
      //  //    }
      //  //    req.imgBuffer = buffer;
      //  //    next();
      //  //  });
      //  //});
      //});
    })
    .catch(
      function(err) {
        console.log('toArray err: ', err);
        res.send('error');
      });
};
exports.getCustom = function(req, res, next) {
  console.log(req.params.width);
  console.log(req.params.height);

};
exports.getSaleNumber = function(req, res, next) {
  console.log('getSaleNumber req: ', req.params.saleNumber);
  res.send(req.params.saleNumber);
};
exports.get = function (req, res) {
  // blobSvc.createContainerIfNotExists(containerName, function(error, result, response){
  //   if(!error){
  //     // Container exists and allows
  //     // anonymous read access to blob
  //     // content and metadata within this container
  //     console.log('result: ', result);
  //     console.log('response: ', response);
  //     res.send('yay, its created');
  //   }
  // });
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
  // var opts = {
  //   method: 'PUT',
  //   uri: process.env.API_URL + "/CMSContentTest/" + folderName,
  //   headers: {
  //     "X-Auth-Token" : process.env.API_TOKEN,
  //     "Access-Control-Expose-Headers" : "Access-Control-Allow-Origin",
  //     "Access-Control-Allow-Origin" : "*",
  //     "content-type": "application/directory"
  //   }
  // };
  var blobUrl, imgName;
  // for(var i=29, len=30; i < len; i++){
    // blah blah
    // console.log('count: ', i);
    // i = (i < 10) ? '0' + i.toString() : i.toString();
    blobUrl = 'uk040216/29.jpg';
    imgName = './app/assets/img/test3/129_001.jpg';
    blobSvc.createBlockBlobFromLocalFile('lots', blobUrl, imgName,     function(err, result, resp) {
      if(!err) {
        console.log('file uploaded!', result);
        console.log('response: ', resp);
      } else {
        console.log('errrr: ', err);
      }
    });
    // if (i + 1 === len) {
    //   res.send('file uploaded!');
    // }
  // }
};
