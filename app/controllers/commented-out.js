// images.js

/*
  1) fetch image from CDN and then pipe into new stream
  2) create buffer from stream to pass to lwip (another image processor)
 so it can do its magick
*/

/*
 exports.fetchFromCDN = function (req, res, next) {
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
 */


// exports.useLwip = function(req, res, next) {
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
// }

