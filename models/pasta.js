"use strict";

var redis = require('redis');
var db = redis.createClient();

var uuid = require('node-uuid');

module.exports = Pasta;

function Pasta(obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
}

Pasta.prototype.save = function(fn) {
  var pasta = this;

  if (!pasta.id) {
    pasta.id = uuid.v4();
  }
  pasta.update(fn);
};

Pasta.prototype.update = function(fn) {
  var pasta = this;
  db.hmset('pasta:' + pasta.id, pasta, function(err) {
    if (err) return fn(err);
    db.sadd(pasta.user_id + ':pastas', pasta.id, function(err) {
      fn(err);
    });
  });
};

Pasta.prototype.delete = function(fn) {
  var pasta = this;
  db.del('pasta:' + pasta.id, function(err) {
    if (err) return fn(err);
    db.srem(pasta.user_id + ':pastas', pasta.id, function(err) {
      fn(err);
    });
  });
};


Pasta.get = function(id, fn) {
  db.hgetall('pasta:' + id, function(err, pasta) {
    if (err) return fn(err);
    fn(null, new Pasta(pasta));
  });
};

Pasta.getByUser = function(user, fn) {
  db.smembers(user.id + ':pastas', function(err, members) {
    if (err) return fn(err);
    fn(err, members);
  });
};
