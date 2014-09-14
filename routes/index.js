var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.format({
    json: function(){
      res.send({message: 'Welcome to CodePasta'});
    },

    html: function(){
      res.render('index', { title: 'CodePasta' });
    }
  });
});

module.exports = router;
