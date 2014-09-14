var expect = require('chai').expect;
var User = require('../../models/user');

describe('User', function() {
  describe('#is_valid', function() {
    describe('with a username and password', function() {
      var user = new User({name: 'mario', pass: 'luigi'});
      
      it('is valid', function() {
        expect(user.is_valid()).to.be.ok;
      });
    });

    describe('without a username', function() {
      var user = new User({pass: 'luigi'});
      
      it('is invalid', function() {
        expect(user.is_valid()).not.to.be.ok;
      });
    });

    describe('without a password', function() {
      var user = new User({name: 'mario'});
      
      it('is invalid', function() {
        expect(user.is_valid()).not.to.be.ok;
      });
    });
  });
});
