var express = require('express');
var router = express.Router();
var User = require('../models/user');

var respond = function(data) {
  res.format({
    json: function(){
      if (data.error) {
        res.send({ error: error });
      } else if (data.message) {
        res.send({ message: message });
      }
    },

    html: function(){
      if (data.error) {
        res.error(error);
      } else if (data.message) {
        res.message(message);
      }
      
      res.redirect(data.redirect);
    }
  });
};

router.get('/register', function(req, res) {
  res.render('users/create', { title: 'Register' });
});

router.post('/', function(req, res) {
  var data = req.body.user;

  if (!data || !data.name || !data.pass) {
    respond({error: 'Username and password are required', redirect: 'back'});
  }

  User.getByName(data.name, function(err, user){
    if (err) return next(err);
    var error, message, redirect;
    if (user.id) {
      respond({error: 'Username already taken!', redirect: 'back'});
    } else {
      user = new User({
        name: data.name,
        pass: data.pass
      });

      user.save(function(err){
        if (err) return next(err);
        req.session.uid = user.id;
        res.redirect('/pastas');
        respond({message: 'You have successfuly registered.', redirect: '/pastas'});
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

    var error, redirect;

    if (user) {
      req.session.uid = user.id;
      redirect = '/pastas';
    } else {
      error = 'Sorry! invalid credentials.';
      redirect = 'back';
    }

    res.format({
      json: function(){
        if(error) {
          res.send({ error: error });
        } else {
          // TODO return a token
          res.send({ message: 'logged in' });
        }
      },

      html: function(){
        if(error) {
          res.error(error);
        }
        res.redirect(redirect);
      }
    });
  });
});

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
  	if (err) throw err;
    res.format({
      json: function(){
        res.send({ message: 'logged out' });
      },

      html: function(){
        res.redirect('/');
      }
    });
  });
});

module.exports = router;
