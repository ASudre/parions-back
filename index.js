/*jslint node: true */
'use strict';

// Dependencies
var app = require('./app'),
	mongoose = require('mongoose'),
	winston = require('winston');

// Server express, needed to close when mongo stops
var server ; 
var dbServer = app.get('mongoHost')+':'+app.get('mongoPort')+'/'+app.get('dbName');

var options = { 
	server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000, poolSize: 5 } }, 
	replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } },
	db: { native_parser: true }
}; 

// On connected event
mongoose.connection.on('connected',function(err){
	if(err){
		winston.error('Erreur lors de la connexion a la BDD, '+err);
	} else {
		winston.info('MongoDB connecté sur '+dbServer);

		// Start express server
		server = app.listen(app.get('port'), function () {
			winston.info('API disponible sur le port : ' + server.address().port);
		}); 
	}
});

// On disconnect
mongoose.connection.on('disconnected', function() {
   winston.info('MongoDB connexion fermée');
   if(typeof server !='undefined'){
		server.close();
		winston.info('Serveur express arrete');
   }
});

// On error
mongoose.connection.on('error', function(err) {
     winston.info('Erreur lors de la connexion a la bdd ' + err);
});

// Useful to avoid connection closed errors
mongoose.connect('mongodb://'+dbServer,options,function(err){
	if(err){
		winston.error('Erreur lors d\'une tentative de connexion a la bdd, '+err);
	}
});
