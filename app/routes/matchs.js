/*jslint node: true */
'use strict';

var express = require('express'),
    Match = require('../schemas/match'),
    router = express.Router();


/*
*****************************
    Méthodes
*****************************
*/

function recuperationMises(elem,userEmail){

    var equipe1 = elem.equipe1.nomEquipe;            
    var equipe2 = elem.equipe2.nomEquipe;  
    var sommeMisesUtilisateur = 0;
    var gainUtilisateur = 0;
    var sommeMisesEq1 = 0;
    var sommeMisesNul = 0;
    var sommeMisesEq2 = 0;
    var miseUtilisateur = [];
    var pariAffiche = {};
    var mises = {};

        for (var mise of elem.mises) {

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
                    return {status:500};
            }

            if(mise.emailUtilisateur == userEmail) {

                pariAffiche = {
                    'equipe': mise.equipe,
                    'valeurMise': mise.valeurMise,
                    'date': mise.date
                };

                miseUtilisateur.push(pariAffiche);
                sommeMisesUtilisateur+=mise.valeurMise;
            }
        }
        
        for (var gain of elem.gains) {
            if(gain.emailUtilisateur == userEmail) {
                gainUtilisateur = gain.gain;
            }
        }

        mises.equipe1 = sommeMisesEq1;
        mises.equipe2 = sommeMisesEq2;
        mises.nul = sommeMisesNul;

        var retour = {
            mises:mises,
            equipe1:equipe1,
            equipe2:equipe2,
            miseUtilisateur:miseUtilisateur,
            gain:gainUtilisateur,
            pariAffiche:pariAffiche,
            sommeMisesUtilisateur:sommeMisesUtilisateur
        };

        return retour;

}

function traiterMises(result){

    var userEmail ='arthursudre@gmail.com';
    var retourMatchs = [];
    var sommeMisesUtilisateur = 0 ; 
    
    for (var elem of result) {

        // Récupération des mises
        var mises = recuperationMises(elem,userEmail);
        
        var matchRes = {
            idMatch: elem.idMatch,
            equipe1: mises.equipe1,
            equipe2: mises.equipe2,
            date: elem.date,
            mises: mises.mises,
            misesUtilisateur: mises.miseUtilisateur,
            pariAffiche: mises.pariAffiche,
            afficherInput: elem.date > new Date(),
            gain: mises.gainUtilisateur
        };

        retourMatchs.push(matchRes);
        sommeMisesUtilisateur+=mises.sommeMisesUtilisateur;

    }

    return {status:200,retour:{matchs: retourMatchs,sommeMisesUtilisateur: sommeMisesUtilisateur}};
}


/*
*****************************
    Routes
*****************************
*/
router.route('/mises')
    .get(function (req, res) {
        Match.find({},function(err, result){

            if(err){
                res.status(500).send();
            }

            // On effectue les traitements des mises
            var mises = traiterMises(result);

            // Retour http
            res.status(mises.status).send(mises.retour);

        }).sort({date: 1});
});

module.exports = router;