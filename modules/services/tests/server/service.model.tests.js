'use strict';

/**
 * Module dependencies.
 */
const should = require('should');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Service = mongoose.model('Service');

/**
 * Globals
 */
let user,
  service;

/**
 * Unit tests
 */
describe('Service Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      password: 'password'
    });

    user.save(function() {
      service = new Service({
        title: 'Service Name',
        description: 'test',
        for: 'Client',
        avalibility: 'Weekly',
        price: 1000,
        pricePer: 'Hour'
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      service.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      service.title = '';

      service.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Service.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
