import mongoose from 'mongoose';

const commentsSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, 
    createdAt: { type: Date, default: Date.now },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post' }, 
});

const comment = mongoose.model('comment', commentsSchema);
export default comment;