// app/models/game.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our game model
var gameSchema = mongoose.Schema({
  name: String,
  rankname: String,
  ranks: [String],
  rank: String
});

// create the model for games and expose it to our app
module.exports = mongoose.model('game', gameSchema);
