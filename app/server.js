// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/keys.js');

const path = require('path');

// configuration ===============================================================
mongoose.connect(configDB.mongoURI); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  //app.use(express.static('client'));
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'build', 'index.html'));
  // });
}

// routes ======================================================================
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./appRoutes.js')(app, passport);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
