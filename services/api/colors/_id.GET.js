var fixture = require('../colors.GET.json');
module.exports = function(params, req, ok) {
  var data = fixture[params._id];
  ok(null, data);
};
