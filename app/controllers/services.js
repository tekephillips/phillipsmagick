var Request = require('request-promise');
var _ = require('lodash');
var opts = {
  method: 'POST',
  uri: 'https://identity.api.rackspacecloud.com/v2.0/tokens',
  headers: {
    "Content-type": "application/json"
  },
  body: {
    "auth":{"RAX-KSKEY:apiKeyCredentials":{"username":"hcannon","apiKey":"3fd74aa96d9209ecf2290aa529e6c465"}}
  },
  json: true
};
var services = function(req, res) {
  Request.post(opts)
    .then(function(res2) {
      var rsToken = res2.access.token,
        serviceCatalog = res2.access.serviceCatalog,
        cloudFiles = _.find(serviceCatalog, ['name', 'cloudFiles']);
      process.env.TENANT_ID = cloudFiles.endpoints[0].tenantId;
      process.env.API_URL = cloudFiles.endpoints[0].publicURL;
      process.env.API_TOKEN = rsToken.id;
      res.send('logged in');
    })
    .catch(function(err) {
      console.log('get errror ', err);
      throw err;
      res.json(err);
    });
};

module.exports = services;