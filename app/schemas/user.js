/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    prenom: String,
    nom: String,
    mail: {
        type: String,
        lowercase: true,
        unique: true
    },
    login: {
        type: String,
        lowercase: true,
        unique: true
    },
    password: String
});

UserSchema.virtual('nomComplet').get(function () {
    return this.prenom + ' ' + this.nom;
});

// Bcrypt password.
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is valid.
UserSchema.methods.validPassword = function(passwordToCheck) {
    return bcrypt.compareSync(passwordToCheck, this.password);
};

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);