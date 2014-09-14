var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/register', function(req, res) {
  res.render('users/create', { title: 'Register' });
});

router.post('/', function(req, res) {
  var data = req.body.user;

  if (!data || !data.name || !data.pass) {
  	res.error("Username and password are required");
  	res.redirect('back');
  }

  User.getByName(data.name, function(err, user){
    if (err) return next(err);

    if (user.id) {
      res.error("Username already taken!");
      res.redirect('back');
    } else {
      user = new User({
        name: data.name,
        pass: data.pass
      });

      user.save(function(err){
        if (err) return next(err);
        req.session.uid = user.id;
        res.redirect('/');
      });
    }
  });
});

router.get('/login', function(req, res) {
  res.render('users/login');
});

router.post('/login', function(req, res) {
  var data = req.body.user;
  User.authenticate(data.name, data.pass, function(err, user){
    if (err) return next(err);
    if (user) {
      req.session.uid = user.id;
      res.redirect('/');
    } else {
      res.error("Sorry! invalid credentials.");
      res.redirect('back');
    }
  });
});

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
  	if (err) throw err;
  	res.redirect('/');
  });
});

module.exports = router;
