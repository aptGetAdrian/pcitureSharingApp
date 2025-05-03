import mongoose from 'mongoose';

const postsSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'}, 
    description: { type: String },
    picturePath: { type: String, required: true},    
    createdAt: { type: Date, default: Date.now },
    likes: { type: Map, of: Boolean },
    comments: [ {
        comment: { type: mongoose.Schema.Types.ObjectId, ref: 'comment' },
    }
    ]

}, { timestamps: true });


const post = mongoose.model('post', postsSchema);
export default post;