if ( process.env.NODE_ENV === 'test' ) {
  var redis = require('node-redis-mock');
} else {
  var redis = require('redis');
}
var db = redis.createClient();

module.exports = db;
