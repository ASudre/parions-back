// app/routes.js

var matchService = require('../services/matchsService.js');

module.exports = function(app, passport) {

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/listMatchs',
            failureRedirect: '/login',
            failureFlash : true // allow flash messages
        })
    );

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/listMatchs', isLoggedIn, function(req, res) {

        matchService.getMatchList(req.user.local.email, function(err, retour) {
            res.render('listMatchs.ejs', { "user": req.user, "listMatchs": retour.matchs, "sommeMisesUtilisateur": retour.sommeMisesUtilisateur });
        })
    });

    app.post('/saveMatch', isLoggedIn, function(req, res) {

        var dateMise = new Date();
        var dateMatch;
        matchService.getMatch(req.body.idMatch, function(retour) { 
            dateMatch = retour[0].date;

            if(dateMise > dateMatch) {
                var reponse = {
                    "error": true,
                    "message": "Trop tard pour miser sur ce match."
                };
                res.send(reponse);
            }
            else {
                matchService.saveMatch(req.user.local.email, req.body.idMatch, req.body.equipe, req.body.mise, function(retour) {
                    res.send(retour);
                });
            }
        });

    });

    app.post('/saveScore', isLoggedIn, function(req, res) {
        matchService.saveScore(req.body.idMatch, req.body.scoreEquipe1, req.body.scoreEquipe2, function(retour) {
            res.send(retour);
        })
    });

    app.get('/listMatchsAdmin', isLoggedIn, function(req, res) {

        matchService.getMatchListAdmin(function(err, retour) {
            res.render('listMatchsAdmin.ejs', { "user": req.user, "listMatchs": retour.matchs });
        })
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/listMatchs', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}