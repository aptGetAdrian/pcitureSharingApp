import post from "../models/postsModel.js";
import user from "../models/userModel.js";


// creating a post

export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;

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
        const Post = await post.find();
        res.status(200).json(Post);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }

}


export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params; 

        const userPosts = await post.find({ author: userId });

        res.status(200).json(userPosts);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }

}


// update
export const likePost = async (req, res) => {
    try {
        const { id } = req.params; 
        const { userId } = req.body;

        const currentPost = await post.findById(id);
        const isLiked = currentPost.likes.get(userId);


        if (isLiked) {
            currentPost.likes.delete(userId);
        } else {
            currentPost.likes.set(userId);
        }
        
        const updatedPost = await post.findByIdAndUpdate(
            id,
            { likes: currentPost.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }




}
