var artists = [
  "Mark Bradford",
    "Andy Warhol",
    "Jeff Koons",
    "Robert Mapplethorpe",
    "Pablo Picasso",
    "Harrison Cannon",
    "Tommy Kim",
    "Megan Newcome",
    "Cristian Suarez",
    "Dave Stacey",
    "Sean Costello",
    "Jamie Timms",
    "Alex Yarmulnik",
    "Ross Ellis",
    "Andy Foster"
  ];

exports.getJSON = function(req, res, next) {
  console.log('getJSON');
  res.setHeader('Access-Control-Allow-Origin','*'
  );
  res.json(artists);
};
