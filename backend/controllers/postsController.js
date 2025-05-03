import post from "../models/postsModel.js";
import user from "../models/userModel.js";


// creating a post

export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;

        const currentUser = await user.findById(userId);

        const newPost = new post({
            author: userId,
            description,
            picturePath,
            likes: {},
            comments: []
        })

        await newPost.save();

        const Post = await post.find();
        res.status(201).json(Post);

    } catch (err) {
        res.status(409).json({ message: err.message });


    }
}


// getting posts

export const getFeedPosts = async (req, res) => {
    try {
        


    } catch (err) {
        res.status(409).json({ message: err.message });
    }



}