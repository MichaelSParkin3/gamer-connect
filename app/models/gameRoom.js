// app/models/gameRoom.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our gameRoom model
var gameRoomSchema = mongoose.Schema({
  title: String,
  gamertag: String,
  game: {},
  time: { type: Date, default: Date.now },
  desc: String,
  avatar: String,
  likes: Number,
  discord: String,
  likerArray: []
});

// create the model for gameRooms and expose it to our app
module.exports = mongoose.model('gameRoom', gameRoomSchema);
