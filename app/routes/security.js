/*jslint node: true */
'use strict';

var express = require('express'),
router = express.Router(),
passport = require('passport');

router.route('/signIn')
    .post(function (req, res) {
        passport.authenticate('local-login', function(err, user) {
            if (err) { 
                res.status(500).send(err);
            } else if (!user) { 
                res.status(401).send();
            } else {
                req.login(user, function(err) {
                    if (err) { 
                        res.status(500).send(err);
                    } else {
                      res.send(user);
                    }
                });
            }
        })(req,res);
    });

module.exports = router;