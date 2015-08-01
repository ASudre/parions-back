/*jslint node: true */
'use strict';

// Dependencies
var express = require('express'),
	passport = require('passport'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	expressSession = require('express-session'),
	cookieParser = require('cookie-parser'),
	app = express();

var generalConfig = require('./config/config.json');

app.set('generalConfig',generalConfig);
app.set('port', process.env.WEB_PORT || generalConfig.webPort);
app.set('mongoPort', process.env.MONGO_PORT || generalConfig.mongoPort);
app.set('mongoHost', process.env.MONGO_HOST || generalConfig.mongoHost);
app.set('dbName', process.env.DB_NAME || generalConfig.dbName);

// Mongo schemas
require('./app/config/passport')(passport);

app.use(function(req, res, next) {
	req.config = generalConfig;
	res.header('Access-Control-Allow-Origin', generalConfig.cors.origin);
  	res.header('Access-Control-Allow-Credentials', generalConfig.cors.allowCredentials);
  	res.header('Access-Control-Allow-Headers', generalConfig.cors.allowHeaders);
  	res.header('Access-Control-Allow-Methods', generalConfig.cors.allowMethods);
  	res.header('Cache-Control', generalConfig.cors.cacheControl);
  	next();
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json({limit:'2mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
	resave : false,
	expire:false,
	name:'cookieUser',
	saveUninitialized : true,
    secret: ' Y3u2m142raiiq2KdXJ2AEpX6WWwgBALv'
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes definition
app.use('/security', require('./app/routes/security'));

// Export
module.exports = app;