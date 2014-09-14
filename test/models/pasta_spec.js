var expect = require('chai').expect;
var Pasta = require('../../models/pasta');

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
});
