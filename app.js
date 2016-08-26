
var express = require('express'),
  config = require('./config/config'),
  azure = require('azure-storage'),
  nconf = require('nconf');
  nconf.env().file({
    file: 'config.json',
    search: true
  });
var app = express();
require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express listening on port ' + config.port);
});

