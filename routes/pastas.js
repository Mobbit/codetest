var express = require('express');
var router = express.Router();
var Pasta = require('../models/pasta');
var User = require('../models/user');

var require_auth = require('../middlewares/require_auth');

router.get('/', require_auth, function(req, res, next) {
  Pasta.getByUser(res.locals.user, function(err, pastas) {
    if (err) {
      return next(err);
    }
    res.format({
      json: function(){
        res.send(pastas);
      },

      html: function(){
        res.render('pastas/index', { title: 'Your Pastas', pastas: pastas });
      }
    });
  });
  
});

router.get('/new', require_auth, function(req, res) {
  res.render('pastas/edit', { title: 'Create Pasta', pasta: {}, action:'/pastas'});
});

router.post('/', require_auth, function(req, res, next) {
  var data = req.body.pasta;

  var pasta = new Pasta({
    "user_id": res.locals.user.id,
    "title": data.title,
    "code": data.code,
    "private": data.private === "true"
  });

  pasta.save(function(err) {
    if (err) {
      return next(err);
    }
    res.format({
      json: function(){
        res.send(pasta);
      },

      html: function(){
        res.redirect('/pastas/' + pasta.id);
      }
    });
  });
});

router.get('/:id', function(req, res) {
  Pasta.get(req.params.id, function(err, pasta) {
    if(pasta.id) {
      if(pasta.private !== 'true' || res.locals.user && pasta.user_id == res.locals.user.id) {
        res.format({
          json: function(){
            res.send(pasta);
          },

          html: function(){
            res.render('pastas/show', { title: pasta.title, pasta: pasta });
          }
        });
      } else {
        res.send(401);
      }
    } else {
      res.send(404);
    }
  });
});

router.put('/:id', require_auth, function(req, res) {
  Pasta.get(req.params.id, function(err, pasta) {
    if(pasta.user_id && pasta.user_id == res.locals.user.id) {
      var data = req.body.pasta;
      
      var pasta = new Pasta({
        id: req.params.id,
        user_id: res.locals.user.id,
        title: data.title,
        code: data.code,
        private: data.private === "true"
      });

      pasta.save(function(err) {
        if (err) {
          return next(err);
        }
        res.format({
          json: function(){
            res.send(pasta);
          },

          html: function(){
            res.redirect('/pastas/' + pasta.id);
          }
        });
      });
    } else {
      res.send(401);
    }
  });
  
});

router.get('/:id/edit', require_auth, function(req, res) {
  Pasta.get(req.params.id, function(err, pasta) {
    if(pasta.user_id == res.locals.user.id) {
      res.render('pastas/edit', { 
        title: 'Edit: ' + pasta.title,
        pasta: pasta,
        action:'/pastas/' + req.params.id + '?_method=PUT'
      });
    } else {
      res.send(401);
    }
  });
});

router.delete('/:id', require_auth, function(req, res) {
  Pasta.get(req.params.id, function(err, pasta) {
    if(err) return next(err);

    var redirect, error, message;
    redirect = '/pastas';

    if(pasta.user_id == res.locals.user.id) {
      pasta.delete(function(err) {
        if(err) {
          error = 'Pasta ' + req.params.id + ' could not be deleted.';
          redirect = '/pastas/' + req.params.id;
        } else {
          message = 'Pasta ' + req.params.id + ' has been deleted.';
        }
      });
    } else {
      error = 'You have no right to delete ' + req.params.user_id;
    }
    res.format({
      json: function(){
        if(error) {
          res.send({error: error})
        } else {
          res.send(pasta);
        }
      },

      html: function(){
        if(error) {
          res.error(error);
        }
        if (message){
          res.message(message);
        }

        res.redirect(redirect);
      }
    });
  });
});

module.exports = router;
