/*jslint node: true */
'use strict';

var User = require('../schemas/User');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        done(null, user.login);
    });

    // used to deserialize the user
    passport.deserializeUser(function(login, done) {
        User.findOne({
            'login': login
        }, function(err, user) {
           console.log('deserializing user:',user);
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'login',
            passwordField: 'password',
        },
        function(login, password, done) {

            process.nextTick(function () {
                User.findOne({
                    login: login
                } , function (err, user) {
                    if (err) { 
                        done(err); 
                    }
                    else if (!user) {
                        done(null, false, { message: 'Incorrect username.' });
                    }
                    else if (!user.validPassword(password)) {
                        done(null, false, { message: 'Incorrect password.' });
                    }
                    else {
                        done(null, user);
                    }
                });
            });
        }
    ));

};


