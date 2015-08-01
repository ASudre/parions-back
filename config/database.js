// config/database.js

var config = {
  "db": "test",  
  "host": "localhost",  
  "user": "",
  "pw": "",
  "port": 27017
};

var port = (config.port.length > 0) ? ":" + config.port : '';
var login = (config.user.length > 0) ? config.user + ":" + config.pw + "@" : '';

module.exports = {

    'url' : "mongodb://" + login + config.host + port + "/" + config.db // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};