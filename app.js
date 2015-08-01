/*jslint node: true */
'use strict';

// Dependencies
var express = require('express'),
	passport = require('passport'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	expressSession = require('express-session'),
	app = express();

var generalConfig = require('./config/config.json');

app.set('generalConfig',generalConfig);
app.set('port', process.env.WEB_PORT || generalConfig.webPort);
app.set('mongoPort', process.env.MONGO_PORT || generalConfig.mongoPort);
app.set('mongoHost', process.env.MONGO_HOST || generalConfig.mongoHost);
app.set('dbName', process.env.DB_NAME || generalConfig.dbName);

app.use(morgan('dev'));
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

// Export
module.exports = app;