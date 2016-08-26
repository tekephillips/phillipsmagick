/**
 * Created by Tkim on 6/23/2016.
 */
var home = require('../controllers/home');
var homeRoute = function(app) {
  app.route('/')
    .get(home.get);
};

module.exports = homeRoute;