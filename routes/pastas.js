var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('list my pastas');
});

router.post('/', function(req, res) {
  res.send('create a pasta');
});

router.get('/:id', function(req, res) {
  res.send('show pasta');
});

router.put('/:id', function(req, res) {
  res.send('update pasta');
});

router.get('/:id/edit', function(req, res) {
  res.send('edit form pasta');
});

router.delete('/:id', function(req, res) {
  res.send('delete pasta');
});

module.exports = router;
