var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

import mongoose from 'mongoose';

var userSchema = new mongoose.Schema({
	username : {type: String, required: true, min: 2, unique: true},
	password : {type: String, required: true, min: 5},
	email: {type: String, required: true, unique: true},
    picturePath: { type: String, default: "/images/1000_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg" }
});


var user = mongoose.model('user', userSchema);
module.exports = user;