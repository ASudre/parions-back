/*jslint node: true */
'use strict';

var express = require('express'),
router = express.Router(),
passport = require('passport');

router.route('/signIn')
    .post(function (req, res) {
        passport.authenticate('local', function(err, user) {
        if (err) { 
            res.status(500).send(err);
        }
        if (!user) { 
            res.status(401).send(err);
        }
        req.login(user, function(err) {
            if (err) { 
                res.status(401).send(err);
            } else {
                res.status(200).send(user);
            }
        });
    })(req, res);
});

router.route('/getConnectedUser').get(function (req,res){
    if(req.isAuthenticated()){
        res.status(200).send(req.user);
    } else {
        res.status(200).send();
    }
});

module.exports = router;