import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../models/userModel.js";



// registering user

export const register = async (req, res) => {
    try {
        const {username, email, password, picturePath, friends} = req.body;
        
        // password encryption
        const salt = await bcrypt.genSalt(); 
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new user ({username, email, password: passwordHash, picturePath, friends});

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}


// logging in

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const currentUser = await user.findOne({ email: email });

        if (!currentUser) {
            return res.status(400).json({ msg: "User does not exist." });
        }


        const isMatched = await bcrypt.compare(password, currentUser.password);
        if (!isMatched) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ id: currentUser._id }, process.env.JWR_SECRET);
        delete currentUser.password;

        res.status(201).json({ token, currentUser });

    } catch (err) {
        res.status(500).json({ error: err.message });

    }



}