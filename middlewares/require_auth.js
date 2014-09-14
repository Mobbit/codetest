module.exports = function(req, res, next) {
  var uid = req.session.uid;
  if (!uid) {
    res.send(401);
  }
  return next();
};