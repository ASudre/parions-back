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

    passport.use('local-login', new LocalStrategy({
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, login, password, done) {
            User.findOne({
                'login': login
            }, function(err, user) {
                // If there is an error, return the error.
                if (err) {
                    return done(err);
                }
                // If user does not exist, is disabled, or password not valid.
                if (!user || !user.validPassword(password)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }));
};
