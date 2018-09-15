// app/Approutes.js
var express = require('express');
const path = require('path');
const router = express.Router();

var User = require('./models/user');

var GameRoom = require('./models/gameRoom');

var Game = require('./models/game');

module.exports = function(app, passport) {
  //post new gameroom object in database
  app.post('/api/gameRoom', isLoggedIn, function(req, res) {
    console.log(req.user);
    console.log(req.body.params);

    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
      '/' +
      (currentdate.getMonth() + 1) +
      '/' +
      currentdate.getFullYear() +
      ' @ ' +
      currentdate.getHours() +
      ':' +
      currentdate.getMinutes() +
      ':' +
      currentdate.getSeconds();

    console.log(req.body.params.game);

    // create the game
    var newGameRoom = new GameRoom();

    // set the user's local credentials
    newGameRoom.title = req.body.params.title;
    newGameRoom.desc = req.body.params.desc;
    newGameRoom.game = req.body.params.game;
    newGameRoom.discord = req.body.params.discord;
    newGameRoom.date = datetime;
    newGameRoom.gamertag = req.user.profile.gamertag;
    newGameRoom.avatar = req.user.profile.avatar;
    newGameRoom.likes = req.user.profile.likes;
    newGameRoom.likerArray = req.user.profile.likerArray;

    // save the game
    newGameRoom.save(function(err) {
      if (err) throw err;
      return;
    });
  });
  //get game room objects by game name
  app.get('/api/gameRoom/name', function(req, res) {
    console.log(req.query.name);
    console.log(req.query.filter);
    if (req.query.name == null) {
      if (req.query.filter == 'new') {
        GameRoom.find({}, null, { sort: '-date' }, function(err, docs) {
          console.log(docs);
          res.send(docs);
        });
      } else if (req.query.filter == 'popular') {
        GameRoom.find({}, null, { sort: { likes: -1 } }, function(err, docs) {
          console.log(docs);
          res.send(docs);
        });
      }
    } else {
      if (req.query.filter == 'new') {
        GameRoom.find(
          { 'game.name': { $regex: req.query.name, $options: 'i' } },
          null,
          { sort: '-date' },
          function(err, docs) {
            console.log(docs);
            res.send(docs);
          }
        );
      } else if (req.query.filter == 'popular') {
        GameRoom.find(
          { 'game.name': { $regex: req.query.name, $options: 'i' } },
          null,
          { sort: { likes: -1 } },
          function(err, docs) {
            console.log(docs);
            res.send(docs);
          }
        );
      }
    }
  });

  //Add like and id to user profile and gamerroom object
  app.post('/api/gameRoom/addLike', isLoggedIn, function(req, res) {
    console.log('------------');
    console.log(req.user._id);
    console.log(req.user.profile.likerArray);
    console.log('------------');
    User.update(
      { 'profile.gamertag': req.body.params.gameRoom.gamertag },
      {
        $push: { 'profile.likerArray': req.user._id }
      },
      { multi: true },
      function(err, numberAffected) {
        console.log(err);
        console.log(numberAffected);
      }
    );

    User.update(
      { 'profile.gamertag': req.body.params.gameRoom.gamertag },
      {
        $inc: { 'profile.likes': 1 }
      },
      { multi: true },
      function(err, numberAffected) {
        console.log(err);
        console.log(numberAffected);
      }
    );

    GameRoom.update(
      { _id: req.body.params.gameRoom._id },
      {
        $push: { likerArray: req.user._id }
      },
      { multi: true },
      function(err, numberAffected) {
        console.log(err);
        console.log(numberAffected);
      }
    );

    GameRoom.update(
      { _id: req.body.params.gameRoom._id },
      {
        $inc: { likes: 1 }
      },
      { multi: true },
      function(err, numberAffected) {
        console.log(err);
        console.log(numberAffected);
        res.send(false);
      }
    );
  });

  //Remove like and id to user profile and gamerroom object
  app.post('/api/gameRoom/removeLike', isLoggedIn, function(req, res) {
    console.log('------------');
    console.log(req.user._id);
    console.log(req.user.profile.likerArray);
    console.log('------------');
    User.update(
      { 'profile.gamertag': req.body.params.gameRoom.gamertag },
      {
        $pull: { 'profile.likerArray': { $in: [req.user._id] } }
      },
      { multi: true },
      function(err, numberAffected) {
        console.log(err);
        console.log(numberAffected);
      }
    );

    User.update(
      { 'profile.gamertag': req.body.params.gameRoom.gamertag },
      {
        $inc: { 'profile.likes': -1 }
      },
      { multi: true },
      function(err, numberAffected) {
        console.log(err);
        console.log(numberAffected);
      }
    );

    GameRoom.update(
      { _id: req.body.params.gameRoom._id },
      {
        $pull: { likerArray: req.user._id }
      },
      { multi: true },
      function(err, numberAffected) {
        console.log(err);
        console.log(numberAffected);
      }
    );

    GameRoom.update(
      { _id: req.body.params.gameRoom._id },
      {
        $inc: { likes: -1 }
      },
      { multi: true },
      function(err, numberAffected) {
        console.log(err);
        console.log(numberAffected);
        res.send(false);
      }
    );
  });

  //Get current user's gamertag
  app.get('/api/getCurrentUser/gamertag', isLoggedIn, function(req, res) {
    console.log(req.user.profile.gamertag);
    res.send(req.user.profile.gamertag);
  });

  //Get current user's _id
  app.get('/api/getCurrentUser/id', isLoggedIn, function(req, res) {
    console.log(req.user._id);
    res.send(req.user._id);
  });

  //Get current user data
  app.get('/api/getCurrentUser', isLoggedIn, function(req, res) {
    console.log(req.user);
    res.send(req.user);
  });

  //Get profile by gamertag
  app.get('/api/profile/gamertag', function(req, res) {
    console.log(req.query.gamertag);
    console.log('------------------------------------');
    User.findOne({ 'profile.gamertag': req.query.gamertag }, (err, data) => {
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
  //Get profile data by the gamertag in the URL
  app.get('/profile/:id', isLoggedIn, function(req, res) {
    console.log(req.params.id);
    var id = req.params.id;
    //do with id whatever you want
  });
};

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
