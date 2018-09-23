// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = require('../models/user');

// load the auth variables
var configAuth = require('./keys');

var bcrypt = require('bcrypt-nodejs');

// expose this function to our app using module.exports
module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    console.log('serializeUser');
    console.log(user);
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser');
    User.findById(id, function(err, user) {
      console.log(id);
      console.log(err);
      console.log(user);
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        //Regular Expression to test password strength
        var mediumRegex = new RegExp(
          '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
        );

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(String(email).toLowerCase()) == false) {
          console.log('not valid email');
        }

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
          User.findOne({ 'local.email': email }, function(err, user) {
            // if there are any errors, return the error
            if (err) return done('something went wrong');

            // check to see if theres already a user with that email
            if (user || re.test(String(email).toLowerCase()) == false) {
              return done('User already exists');
            } else if (!mediumRegex.test(password)) {
              console.log('weak password');
              return done('weak password');
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User();

              // set the user's local credentials
              newUser.local.email = email;
              newUser.local.password = newUser.generateHash(password);

              // save the user
              newUser.save(function(err) {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use(
    'local-login',
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        console.log('lol-----');
        console.log('email: ' + email + ' password: ' + password);
        // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email': email }, function(err, user) {
          console.log(user);
          // if there are any errors, return the error before anything else
          if (err) return done('something went wrong', false);

          // if no user is found, return the message
          if (!user) return done('no user found', false); // req.flash is the way to set flashdata using connect-flash

          // if the user is found but the password is wrong
          if (!user.validPassword(password)) {
            console.log('WRONG PASS');
            return done('wrong password', false);
          } // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          console.log('lol-----');
          return done(null, user);
        });
      }
    )
  );

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================

  passport.use(
    'custom-facebook',
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        console.log(password);
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
          User.findOne({ 'facebook.email': email }, function(err, user) {
            // if there are any errors, return the error
            if (err) return done('something went wrong');

            // check to see if theres already a user with that email
            if (user) {
              user.facebook.token = bcrypt.hashSync(
                password,
                bcrypt.genSaltSync(8),
                null
              );
              console.log('user exists');
              console.log(user);
              return done(null, user);
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User();

              // set the user's local credentials
              newUser.facebook.email = email;
              newUser.facebook.token = newUser.generateHash(password);

              // save the user
              newUser.save(function(err) {
                if (err) throw err;
                return done('signed up', newUser);
              });
            }
          });
        });
      }
    )
  );
};
