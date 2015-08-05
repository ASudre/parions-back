/*jslint node: true */
'use strict';

var express = require('express'),
router = express.Router(),
passport = require('passport');

var Match = require('../schemas/match'),
    match = {};

router.route('/mises')
    .get(function (req, res) {

        Match.find({}).sort( { date: 1 } ).exec(function(err, result) {
        
            var userEmail ="arthursudre@gmail.com";
            var retourMatchs = new Array();
            var sommeMisesUtilisateur = 0;
            var matchIt;

            for (matchIt of result) {

                var mise;
                var mises = matchIt.mises;
                var sommeMisesEq1 = 0;
                var sommeMisesNul = 0;
                var sommeMisesEq2 = 0;
            
                var idMatch = matchIt.idMatch;
                var equipe1 = matchIt.equipe1.nomEquipe;            
                var equipe2 = matchIt.equipe2.nomEquipe;        
                var date = matchIt.date;
                var gains = matchIt.gains;

                var miseUtilisateur = new Array();
                var pariAffiche="";

                // Ne pas afficher la possibilité de miser si la date de début de match est dépassée
                var dateCourante = new Date();
                var afficherInput = date > dateCourante;

                for (mise of mises) {

                    switch(mise.equipe) {
                        case equipe1:
                            sommeMisesEq1+=mise.valeurMise;
                            break;
                        case equipe2:
                            sommeMisesEq2+=mise.valeurMise;
                            break;
                        case 'Nul':
                            sommeMisesNul+=mise.valeurMise;
                            break;
                        default:
                            console.log("Mise ne correspondant pas au match " + idMatch);
                    }

                    if(mise.emailUtilisateur == userEmail) {

                        pariAffiche = {
                            "equipe": mise.equipe,
                            "valeurMise": mise.valeurMise,
                            "date": mise.date
                        };

                        miseUtilisateur.push(pariAffiche);
                        sommeMisesUtilisateur+=mise.valeurMise;
     
                    }

                }


                var gainUtilisateur = 0;
                for (gain of gains) {
                    if(gain.emailUtilisateur == userEmail) {
                        gainUtilisateur = gain.gain;
                    }
                }

                var mises = {};

                mises['equipe1'] = sommeMisesEq1;
                mises['nul'] = sommeMisesNul;
                mises['equipe2'] = sommeMisesEq2;

                var matchRes = {
                    "idMatch": idMatch,
                    "equipe1": equipe1,
                    "equipe2": equipe2,
                    "date": date,
                    "mises": mises,
                    "misesUtilisateur": miseUtilisateur,
                    "nouvelleMiseValeur": 0,
                    "nouvelleMiseEquipe": "",
                    "pariAffiche": pariAffiche,
                    "afficherInput": afficherInput,
                    "gain": gainUtilisateur
                };

                retourMatchs.push(matchRes);
            }

            var retour = {"matchs": retourMatchs, "sommeMisesUtilisateur": sommeMisesUtilisateur};
            console.log(retour);

            res.status(200).send({ "user": req.user, "listeMatchs": retour.matchs, "sommeMisesUtilisateur": retour.sommeMisesUtilisateur });
        });
});

module.exports = router;