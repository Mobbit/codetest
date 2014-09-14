module.exports = function(req, res, next) {
  if (!req.user) {
    res.send(401).end();
  } else {
    return next();
  }
};