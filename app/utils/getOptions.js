/**
 * Created by TKim on 8/24/2016.
 */
_(req.files).each(function(item, i) {
  var nameArr = item.originalname.split('.');
  var fileName = nameArr[0] + "-" + makerName,
    fileExt = "." + nameArr[1];
  _(bannerType.sizes).each(function(size, index) {
    gm(item.buffer, fileName)
      .resize(size.width)
      .toBuffer(fileExt.toUpperCase(),function (err, buffer) {
        if (err) return handle(err);
        Request.put(opts)
          .then(function(parsedBody1) {
            opts.uri = process.env.API_URL + "/CMSContentTest/" + folderName + "/" + fileName + "/" + size.label + fileExt;
            opts.body = buffer;
            opts.headers["content-type"] = item.mimetype;
            Request.put(opts)
              .then(function(parsedBody2) {
                console.log('success2! index ', index, bannerType.sizes.length);
                if ((index + 1) === bannerType.sizes.length) {
                  res.send("success!");
                }
              })
              .catch(function(err) {
                console.log("err ",err);
                res.json(err);
                throw err;
              });
            // res.json(parsedBody);
          })
          .catch(function(err) {
            console.log("err ",err);
            res.json(err);
            throw err;
          });
      });
  });
});

module.exports;
