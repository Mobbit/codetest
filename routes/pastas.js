var express = require('express');
var router = express.Router();
var Pasta = require('../models/pasta');

router.get('/', function(req, res, next) {
  Pasta.getByUser(res.locals.user, function(err, pastas) {
    if (err) {
      return next(err);
    }

    res.render('pastas/index', { title: 'Your Pastas', pastas: pastas });
  });
  
});

router.get('/new', function(req, res) {
  res.render('pastas/edit', { title: 'Create Pasta', pasta: {}, action:'/pastas'});
});

router.post('/', function(req, res, next) {
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
    res.redirect('/pastas/' + pasta.id);
  });
});

router.get('/:id', function(req, res) {
  Pasta.get(req.params.id, function(err, pasta) {
    if(pasta.id) {
      if(pasta.private !== 'true' || res.locals.user && pasta.user_id == res.locals.user.id) {
        res.render('pastas/show', { title: pasta.title, pasta: pasta });
      } else {
        res.send(401);
      }
    } else {
      res.send(404);
    }
  });
});

router.put('/:id', function(req, res) {
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
      console.log(err);
      return next(err);
    }
    res.redirect('/pastas/' + pasta.id);
  });
});

router.get('/:id/edit', function(req, res) {
  Pasta.get(req.params.id, function(err, pasta) {
    res.render('pastas/edit', { 
      title: 'Edit: ' + pasta.title,
      pasta: pasta,
      action:'/pastas/' + req.params.id + '?_method=PUT'
    }); 
  });
});

router.delete('/:id', function(req, res) {
  Pasta.get(req.params.id, function(err, pasta) {
    if(err) return next(err);

    if(pasta.user_id == res.locals.user.id) {
      pasta.delete(function(err) {
        if(err) {
          res.error('Pasta ' + req.params.id + ' could not be deleted.');
          res.redirect('/pastas/' + req.params.id);
        } else {
          res.message('Pasta ' + req.params.id + ' has been deleted.');
          res.redirect('/pastas');
        }
      });
    } else {
      res.error('You have no right to delete ' + req.params.user_id);
      res.redirect('/pastas');
    }
  });
});

module.exports = router;
