/*jslint node: true */
'use strict';

var User = require('../schemas/User');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.login);
    });

    // used to deserialize the user
    passport.deserializeUser(function(login, done) {
        User.findOne({
            'login': login
        }, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'login',
            passwordField: 'password',
        },
        function(login, password, done) {
            User.findOne({
                login: login
            } , function (err, user) {
            if (err) { 
                done(err); 
            }
            if (!user) {
                done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                done(null, false, { message: 'Incorrect password.' });
            }
              done(null, user);
            });
        }
    ));

};


