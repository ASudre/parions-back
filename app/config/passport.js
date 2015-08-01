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
            user = user.toJSON();
            user.permissions = [];
            user.groups.forEach(function(group) {
                user.permissions = user.permissions.concat(group.permissions);
            });
            user.hasPermission = function(permission) {
                return user.permissions.indexOf(permission) !== -1;
            };
            done(err, user);
        }).populate('groups');
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
                if (!user || !user.enabled || !user.validPassword(password)) {
                    return done(null, false);
                }

                user = user.toJSON();

                // Load permissions.
                user.permissions = [];
                user.groups.forEach(function(group) {
                    user.permissions = user.permissions.concat(group.permissions);
                });

                // Check if user has connect permissions.
                /*if (user.permissions.indexOf('CONNECT') < 0) {
                    return done(null, false);
                }*/

                user.hasPermission = function(permission) {
                    return user.permissions.indexOf(permission) !== -1;
                };

                return done(null, user);
                
            }).populate('groups');
        }));
};
