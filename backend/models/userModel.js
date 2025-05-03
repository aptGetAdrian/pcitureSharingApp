import mongoose from 'mongoose';

var userSchema = new mongoose.Schema({
	username : {type: String, required: true, min: 2, unique: true},
	password : {type: String, required: true, min: 5},
	email: {type: String, required: true, unique: true},
    picturePath: {type: String, default: "/images/1000_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg" },
    fiends: {type: Array, default: []},
}, { timestamps: true });


const user = mongoose.model('user', userSchema);
export default user;

