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

  describe('#hashPassword', function() {
    var user = new User({name: 'mario', pass: 'luigi'});

    it('uses bcrypt to hash the password', function(done) {
      user.hashPassword(function() {
        expect(user.pass).not.to.equal('luigi');
        done();
      });
    });
    it('uses adds a salt to the user', function(done) {
      user.hashPassword(function() {
        expect(user.salt).not.to.be;
        done();
      });
    });
  });
});
