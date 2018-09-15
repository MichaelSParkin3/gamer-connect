// app/routes.js
var express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: './client/src/imgs/uploads',
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname +
        '-' +
        Date.now() +
        path.extname(file.originalname) +
        '.png'
    );
  }
});

//const upload = multer({ dest: 'public/uploads/avatars', storage: storage });
var upload = multer({
  dest: './client/src/imgs/uploads',
  storage: storage
}).single('avatar');

var User = require('./models/user');

// load up the user model
var Game = require('./models/game');

// Set The Storage Engine
// const storage = multer.diskStorage({
//   destination: './public/uploads/avatar',
//   filename: function(req, file, cb) {
//     console.log('hi');
//     cb(
//       null,
//       file.fieldname + '-' + Date.now() + path.extname(file.originalname)
//     );
//   }
// });

// Init Upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 }
// }).single('image');

module.exports = function(app, passport) {
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  // app.get('/', function(req, res) {
  //   //res.send('index'); // load the index.ejs file
  // });

  // =====================================
  // CUSTOM ==============================
  // =====================================

  app.get('/login-check', function(req, res) {
    console.log(req.query.email);
    //res.send({ name: 'lol' });

    User.findOne({ 'local.email': req.query.email }, (err, data) => {
      if (err) {
        return res.json({
          success: false,
          message: 'A user with that username already exists. '
        });
      }
      console.log('---' + data);
      res.send(data);
    });
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {
    console.log('LOGIN');
    // render the page and pass in any flash data if it exists
    //res.send('index', { message: req.flash('loginMessage') });
    res.send({ message: req.flash('loginMessage') });
  });

  // process the login form
  // app.post(
  //   '/login',
  //   passport.authenticate('local-login', {
  //     successRedirect: '/profile', // redirect to the secure profile section
  //     failureRedirect: '/login', // redirect back to the signup page if there is an error
  //     failureFlash: true // allow flash messages
  //   })
  // );

  // var message;
  //
  // app.post(
  //   '/login',
  //   passport.authenticate('local-login', function(err, user, info) {
  //     console.log('err' + err);
  //     message = null;
  //     message = err;
  //     //res.send(message);
  //     //return next(err);
  //   })
  // );

  app.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      console.log('err' + err);
      //res.send('err ' + err);
      if (user) {
        //Establish a session and serializeUser
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.send('/');
        });
      } else if (err == 'wrong password') {
        res.send(err);
      } else if (err == 'no user found') {
        res.send(err);
      }
    })(req, res, next);
  });

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.send('index', { message: req.flash('signupMessage') });
  });

  // // process the signup form
  // app.post(
  //   '/signup',
  //   passport.authenticate('local-signup', {
  //     successRedirect: '/profile', // redirect to the secure profile section
  //     failureRedirect: '/signup', // redirect back to the signup page if there is an error
  //     failureFlash: true // allow flash messages
  //   })
  // );

  app.post('/signup', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
      console.log('err' + err);
      //res.send('err ' + err);
      if (err == 'User already exists') {
        res.send(err);
      } else if (err == 'weak password') {
        res.send(err);
      } else if (user) {
        //Establish a session and serializeUser
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.send('/');
        });
      }
    })(req, res, next);
  });

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    console.log('PROFILE ROUTE');
    console.log(req.user);
    res.send({
      user: req.user // get the user out of session and pass to template
    });
  });

  app.post('/profile/create', isLoggedIn, function(req, res) {
    console.log('-----------------------');
    console.log(req.body.params);
    console.log(req.user);
    User.update(
      { _id: req.user._id },
      {
        profile: {
          gamertag: req.body.params.gamertag,
          games: req.body.params.games,
          bio: req.body.params.bio,
          sex: req.body.params.sex,
          age: req.body.params.age,
          birthday: req.body.params.birthday,
          likes: 0,
          likerArray: []
        }
      },
      { multi: true },
      function(err, numberAffected) {
        console.log(err);
        console.log(numberAffected);
        res.send(req.user);
      }
    );
  });

  app.post('/profile/create/image', isLoggedIn, function(req, res, next) {
    upload(req, res, function(err) {
      if (err) {
        console.log(err);
        // An error occurred when uploading
        return;
      }
      console.log(req.file);
      User.findByIdAndUpdate(
        { _id: req.user._id },

        {
          $set: {
            'profile.avatar': '/' + req.file.filename
          }
        },
        function(err, numberAffected) {
          console.log(err);
          console.log(numberAffected);
          // find adventure by id and execute immediately
          User.findById(req.user._id, function(err, updatedUser) {
            console.log(updatedUser);
            res.send(updatedUser);
          });
        }
      );
      // Everything went fine
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login

  //router.get('/facebook', passport.authenticate('facebook'));

  // app.get(
  //   '/auth/facebook',
  //   passport.authenticate('facebook', {
  //     scope: ['public_profile', 'email']
  //   })
  // );

  // app.get('/auth/facebook', function(req, res) {
  //   console.log('Routes Get Facebook');
  //   passport.authenticate('facebook', {
  //     scope: ['public_profile', 'email']
  //   });
  // });

  // handle the callback after facebook has authenticated the user
  app.post('/facebook', function(req, res, next) {
    console.log('facebook route');
    passport.authenticate('custom-facebook', function(err, user, info) {
      console.log('err' + err);

      console.log(res);
      console.log(info);
      console.log('----------');
      console.log(user);

      //Establish a session and serializeUser
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        } else if (user.profile.gamertag != null) {
          return res.send({ path: 'to profile page', userObject: user });
        }
        return res.send('/');
      });
    })(req, res, next);
  });

  // route for logging out
  app.get('/logout', function(req, res) {
    req.logout();
  });

  app.get('/api/searchgames', function(req, res) {
    console.log(req.query.term);
    var term = req.query.term;

    Game.find({ name: { $regex: term, $options: 'i' } }, function(err, docs) {
      console.log(docs);
      res.send(docs);
    });
  });

  app.get('/api/checkduplicate', function(req, res) {
    console.log(req.query.gamertag);
    User.findOne(
      {
        'profile.gamertag': {
          $regex: new RegExp('^' + req.query.gamertag + '$', 'i')
        }
      },
      function(err, user) {
        console.log(user);
        if (user != null) {
          console.log('FOUND ONE');
          res.send(false);
        } else {
          res.send(true);
        }
      }
    );
  });
};

//   app.get('/api/searchgames', function(req, res) {
//     // create the game
//     var newGame = new Game();
//
//     // set the user's local credentials
//     newGame.name = 'Test4';
//     newGame.rankname = 'Division';
//     newGame.ranks = ['Diamond1', 'Platinum2', 'Gold3', 'Silver4', 'Bronze5'];
//     newGame.rank = null;
//
//     // save the game
//     newGame.save(function(err) {
//       if (err) throw err;
//       return;
//     });
//   });
// };

// // create the game
// var newGame = new Game();
//
// // set the user's local credentials
// newGame.game.name = 'Tekken 7';
// newGame.game.rankname = 'Rank';
//
// // save the game
// newGame.save(function(err) {
//   if (err) throw err;
//   return;
// });

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  console.log('CheckLoggedIn');
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    console.log('isAuthenticated');
    return next();
  }
  console.log('notAuthenticated');
  // if they aren't redirect them to the home page
  res.redirect('/');
}
