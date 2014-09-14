var expect = require('chai').expect;
var Pasta = require('../../models/pasta');
var db = require('../../lib/db');

describe('Pasta', function() {
  describe('#is_valid', function() {
    describe('with a title and code', function() {
      var pasta = new Pasta({title: 'Hello World', code: 'alert("Hello World");'});
      
      it('is valid', function() {
        expect(pasta.is_valid()).to.be.ok;
      });
    });

    describe('without title', function() {
      var pasta = new Pasta({code: 'alert("Hello World");'});
      
      it('is invalid', function() {
        expect(pasta.is_valid()).not.to.be.ok;
      });
    });

    describe('without code', function() {
      var pasta = new Pasta({title: 'Hello World'});
      
      it('is invalid', function() {
        expect(pasta.is_valid()).not.to.be.ok;
      });
    });
  });

  describe('#save', function() {
    var pasta = new Pasta({user_id: 1, title: 'Hello World', code: 'alert("Hello World");'});

    it('generates a id', function(done) {
      pasta.save(function() {
        expect(pasta.id).to.have.length(36);
        done();
      });
    });

    it('saves', function(done) {
      pasta.save(function() {
        var stored_pasta = db.hgetall('pasta:' + pasta.id);
        expect(stored_pasta.title).to.equal(pasta.title);
        done();
      });
    });

    it('adds id to user index', function(done) {
      pasta.save(function() {
        expect(pasta.id).to.have.length(36);
        done();
      });
    });
  });
});
