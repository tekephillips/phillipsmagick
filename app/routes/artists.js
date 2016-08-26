var artists = require('../controllers/artists');
var artistsRoute = function(app) {
  app.route('/artists')
    .get(artists.getJSON)
};
module.exports = artistsRoute;
