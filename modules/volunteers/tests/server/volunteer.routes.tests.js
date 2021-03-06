'use strict';

const should = require('should');
const request = require('supertest');
const path = require('path');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Volunteer = mongoose.model('Volunteer');
const express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
let app,
  agent,
  credentials,
  user,
  volunteer;

/**
 * Volunteer routes tests
 */
// describe('Volunteer CRUD tests', function() {
//
//   before(function(done) {
//     // Get application
//     app = express.init(mongoose);
//     agent = request.agent(app);
//
//     done();
//   });
//
//   beforeEach(function(done) {
//     // Create user credentials
//     credentials = {
//       email: 'test@example.com',
//       password: 'M3@n.jsI$Aw3$0m3'
//     };
//
//     // Create a new user
//     user = new User({
//       firstName: 'Full',
//       lastName: 'Name',
//       displayName: 'Full Name',
//       email: credentials.email,
//       password: credentials.password,
//       provider: 'local',
//       roles: 'admin'
//     });
//
//     // Save a user to the test db and create new Volunteer
//     user.save(function(err) {
//       if (err) {
//         return console.error(err);
//       }
//
//       volunteer = {
//         started: new Date(),
//         active: true,
//         contact: {
//           firstName: 'test',
//           lastName: 'user'
//         }
//       };
//     });
//   });
//
//   // it('should be able to save a Volunteer if logged in as an admin', function(done) {
//   //   agent.post('/api/auth/signin')
//   //     .send(credentials)
//   //     .expect(200)
//   //     .end(function(signinErr, signinRes) {
//   //       // Handle signin error
//   //       if (signinErr) {
//   //         return done(signinErr);
//   //       }
//   //
//   //       // Get the userId
//   //       let userId = user.id;
//   //       console.log(volunteer);
//   //
//   //       // Save a new Volunteer
//   //       agent.post('/api/volunteers')
//   //         .send(volunteer)
//   //         .expect(200)
//   //         .end(function(volunteerSaveErr, volunteerSaveRes) {
//   //           // Handle Volunteer save error
//   //           if (volunteerSaveErr) {
//   //             return done(volunteerSaveErr);
//   //           }
//   //
//   //           // Get a list of Volunteers
//   //           agent.get('/api/volunteers')
//   //             .end(function(volunteersGetErr, volunteersGetRes) {
//   //               // Handle Volunteers save error
//   //               if (volunteersGetErr) {
//   //                 return done(volunteersGetErr);
//   //               }
//   //
//   //               // Get Volunteers list
//   //               let volunteers = volunteersGetRes.body;
//   //
//   //               // Set assertions
//   //               console.log(volunteers);
//   //               (volunteers[0].active).should.be.true();
//   //
//   //               // Call the assertion callback
//   //               done();
//   //             });
//   //         });
//   //     });
//   // });
//
//   // it('should not be able to save an Volunteer if not logged in', function(done) {
//   //   agent.post('/api/volunteers')
//   //     .send(volunteer)
//   //     .expect(403)
//   //     .end(function(volunteerSaveErr, volunteerSaveRes) {
//   //       // Call the assertion callback
//   //       done(volunteerSaveErr);
//   //     });
//   // });
//
//   // it('should not be able to save an Volunteer if no name is provided', function (done) {
//   //   // Invalidate name field
//   //   volunteer.name = '';
//   //
//   //   agent.post('/api/auth/signin')
//   //     .send(credentials)
//   //     .expect(200)
//   //     .end(function (signinErr, signinRes) {
//   //       // Handle signin error
//   //       if (signinErr) {
//   //         return done(signinErr);
//   //       }
//   //
//   //       // Get the userId
//   //       let userId = user.id;
//   //
//   //       // Save a new Volunteer
//   //       agent.post('/api/volunteers')
//   //         .send(volunteer)
//   //         .expect(400)
//   //         .end(function (volunteerSaveErr, volunteerSaveRes) {
//   //           // Set message assertion
//   //           (volunteerSaveRes.body.message).should.match('Please fill Volunteer name');
//   //
//   //           // Handle Volunteer save error
//   //           done(volunteerSaveErr);
//   //         });
//   //     });
//   // });
//
//   // it('should be able to update an Volunteer if signed in as an admin', function(done) {
//   //   agent.post('/api/auth/signin')
//   //     .send(credentials)
//   //     .expect(200)
//   //     .end(function(signinErr, signinRes) {
//   //       // Handle signin error
//   //       if (signinErr) {
//   //         return done(signinErr);
//   //       }
//   //
//   //       // Get the userId
//   //       let userId = user.id;
//   //       console.log(volunteer);
//   //
//   //       // Save a new Volunteer
//   //       // agent.post('/api/volunteers')
//   //       //   .send(volunteer)
//   //       //   .expect(200)
//   //       //   .end(function(volunteerSaveErr, volunteerSaveRes) {
//   //       //     // Handle Volunteer save error
//   //       //     if (volunteerSaveErr) {
//   //       //       return done(volunteerSaveErr);
//   //       //     }
//   //
//   //       // Update Volunteer name
//   //       volunteer.active = false;
//   //
//   //       // Update an existing Volunteer
//   //       agent.put('/api/volunteers/' + volunteer._id)
//   //         .send(volunteer)
//   //         .expect(200)
//   //         .end(function(volunteerUpdateErr, volunteerUpdateRes) {
//   //           // Handle Volunteer update error
//   //           if (volunteerUpdateErr) {
//   //             return done(volunteerUpdateErr);
//   //           }
//   //
//   //           // Set assertions
//   //           (volunteerUpdateRes.body._id).should.equal(volunteer._id);
//   //           (volunteerUpdateRes.body.active).should.be.false();
//   //
//   //           // Call the assertion callback
//   //           done();
//   //         });
//   //         // });
//   //     });
//   // });
//
//   // it('should be able to get a list of Volunteers if not signed in', function (done) {
//   //   // Create new Volunteer model instance
//   //   let volunteerObj = new Volunteer(volunteer);
//   //
//   //   // Save the volunteer
//   //   volunteerObj.save(function () {
//   //     // Request Volunteers
//   //     request(app).get('/api/volunteers')
//   //       .end(function (req, res) {
//   //         // Set assertion
//   //         res.body.should.be.instanceof(Array).and.have.lengthOf(1);
//   //
//   //         // Call the assertion callback
//   //         done();
//   //       });
//   //
//   //   });
//   // });
//
//   // it('should be able to get a single Volunteer if not signed in', function (done) {
//   //   // Create new Volunteer model instance
//   //   let volunteerObj = new Volunteer(volunteer);
//   //
//   //   // Save the Volunteer
//   //   volunteerObj.save(function () {
//   //     request(app).get('/api/volunteers/' + volunteerObj._id)
//   //       .end(function (req, res) {
//   //         // Set assertion
//   //         res.body.should.be.instanceof(Object).and.have.property('name', volunteer.name);
//   //
//   //         // Call the assertion callback
//   //         done();
//   //       });
//   //   });
//   // });
//
//   it('should return proper error for single Volunteer with an invalid Id, if not signed in', function(done) {
//     // test is not a valid mongoose Id
//     request(app).get('/api/volunteers/test')
//       .end(function(req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'Volunteer is invalid');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   it('should return proper error for single Volunteer which doesnt exist, if not signed in', function(done) {
//     // This is a valid mongoose Id but a non-existent Volunteer
//     request(app).get('/api/volunteers/559e9cd815f80b4c256a8f41')
//       .end(function(req, res) {
//         // Set assertion
//         res.body.should.be.instanceof(Object).and.have.property('message', 'No Volunteer with that identifier has been found');
//
//         // Call the assertion callback
//         done();
//       });
//   });
//
//   // it('should be able to delete an Volunteer if signed in', function(done) {
//   //   agent.post('/api/auth/signin')
//   //     .send(credentials)
//   //     .expect(200)
//   //     .end(function(signinErr, signinRes) {
//   //       // Handle signin error
//   //       if (signinErr) {
//   //         return done(signinErr);
//   //       }
//   //
//   //       // Get the userId
//   //       let userId = user.id;
//   //
//   //       // Save a new Volunteer
//   //       agent.post('/api/volunteers')
//   //         .send(volunteer)
//   //         .expect(200)
//   //         .end(function(volunteerSaveErr, volunteerSaveRes) {
//   //           // Handle Volunteer save error
//   //           if (volunteerSaveErr) {
//   //             return done(volunteerSaveErr);
//   //           }
//   //
//   //           // Delete an existing Volunteer
//   //           agent.delete('/api/volunteers/' + volunteerSaveRes.body._id)
//   //             .send(volunteer)
//   //             .expect(200)
//   //             .end(function(volunteerDeleteErr, volunteerDeleteRes) {
//   //               // Handle volunteer error error
//   //               if (volunteerDeleteErr) {
//   //                 return done(volunteerDeleteErr);
//   //               }
//   //
//   //               // Set assertions
//   //               (volunteerDeleteRes.body._id).should.equal(volunteerSaveRes.body._id);
//   //
//   //               // Call the assertion callback
//   //               done();
//   //             });
//   //         });
//   //     });
//   // });
//
//   it('should not be able to delete an Volunteer if not signed in', function(done) {
//     // Set Volunteer user
//     volunteer.user = user;
//
//     // Create new Volunteer model instance
//     let volunteerObj = new Volunteer(volunteer);
//
//     // Save the Volunteer
//     volunteerObj.save(function() {
//       // Try deleting Volunteer
//       request(app).delete('/api/volunteers/' + volunteerObj._id)
//         .expect(403)
//         .end(function(volunteerDeleteErr, volunteerDeleteRes) {
//           // Set message assertion
//           (volunteerDeleteRes.body.message).should.match('User is not authorized');
//
//           // Handle Volunteer error error
//           done(volunteerDeleteErr);
//         });
//
//     });
//   });
//
//   afterEach(function(done) {
//     User.remove().exec(function() {
//       Volunteer.remove().exec(done);
//     });
//   });
// });
