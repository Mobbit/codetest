var expect = require('chai').expect;
var Pasta = require('../../models/pasta');
var db = require('../../lib/db');

describe('Pasta', function() {
  beforeEach(function(done) {
    db.flushdb(done);
  });

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
    var pasta;

    beforeEach(function() {
      pasta = new Pasta({user_id: 1, title: 'Hello World', code: 'alert("Hello World");'});
    });

    it('generates a id', function(done) {
      pasta.save(function() {
        expect(pasta.id).to.have.length(36);
        done();
      });
    });

    it('saves', function(done) {
      pasta.save(function() {
        Pasta.get(pasta.id, function(err, stored_pasta) {
          expect(stored_pasta.title).to.equal(pasta.title);
          done();
        });
      });
    });
  });

  describe('#delete', function() {
    var pasta;

    beforeEach(function(done) {
      pasta = new Pasta({user_id: 1, title: 'Hello World', code: 'alert("Hello World");'});
      pasta.save(done);
    });

    it('deletes', function(done) {
      pasta.delete(function() {
        Pasta.get(pasta.id, function(err, deleted_pasta) {
          expect(deleted_pasta).to.be.null;
          done();
        });        
      });
    });
  });

  describe('#getByUser', function() {
    describe('with a user having pasta', function() {
      var pasta;
      var pastas;

      beforeEach(function(done) {
        pasta = new Pasta({user_id: 1, title: 'Hello World', code: 'alert("Hello World");'});
        pasta.save(function() {
          Pasta.getByUser({ id: 1 }, function(err, collection) {
            pastas = collection;
            done();
          });
        });
      });

      it('returns a list of pastas for the user', function() {
        expect(pastas.pop().title).to.equal(pasta.title);
      });
    });

    describe('with a user having pasta', function() {
      var pastas;

      beforeEach(function(done) {
        Pasta.getByUser({ id: 1 }, function(err, collection) {
          pastas = collection;
          done();
        });
      });

      it('returns a list of pastas for the user', function() {
        expect(pastas.length).to.equal(0);
      });
    });

  });
});
