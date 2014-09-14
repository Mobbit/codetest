if ( process.env.NODE_ENV === 'test' ) {
  var redis = require('node-redis-mock');
} else {
  var redis = require('redis');
}

module.exports = redis.createClient();
