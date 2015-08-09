/*jslint node: true */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var fields = {
  idMatch: { 
    type: Number 
  },
  date: { 
    type: Date 
  },
  equipe1: {
    idEquipe: Number,
    nomEquipe: String,
    score: Number
  },
  equipe2: { 
    idEquipe: Number,
    nomEquipe: String,
    score: Number
  },
  mises: [
    { 
      emailUtilisateur: String, 
      valeurMise: Number, 
      equipe: String, 
      date: { 
        type: Date, 
        default: Date.now 
      }
    }
  ],
  gains: [
    { 
      emailUtilisateur: String, 
      gain: Number
    }
  ]
};

var MatchSchema = new Schema(fields);
var Match = mongoose.model('Match', MatchSchema);

module.exports = Match;

//////// Initialisation des données /////////
var fs=require('fs');
fs.readFile('./app/models/matches.json', { encoding: 'utf8' }, function(err,data){          

  if (err) {
    console.log(err);
    return ;
  }

  var datafromfile=JSON.parse(data);
  Match.collection.remove();

  datafromfile.forEach(function(obj){
    
    var catOb=new Match(obj);
    catOb.save(function(){
      console.log('Ajout match en base');
    });

  });
});