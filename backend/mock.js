import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';


import user from "./models/userModel.js";
import post from "./models/postsModel.js";
import comment from "./models/commentsModel.js";

mongoose.connect('mongodb://127.0.0.1/vaja4myProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function generateMockData() {
  try {
    await mongoose.connection.dropDatabase();

    // Create Users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const User = new user({
        username: faker.internet.username(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        picturePath: faker.image.avatar(),
        friends: [],
      });
      await User.save();
      users.push(User);
    }

    // Create Posts
    const posts = [];
    for (let i = 0; i < 5; i++) {
      const Post = new post({
        author: faker.helpers.arrayElement(users)._id,
        description: faker.lorem.sentence(),
        picturePath: faker.image.url(),
        likes: new Map([[users[0]._id, true]]), // Example: first user liked the post
        comments: [],
      });
      await Post.save();
      posts.push(Post);
    }

    // Create Comments and SubComments
    for (let i = 0; i < 10; i++) {
      const Post = faker.helpers.arrayElement(posts);
      const author = faker.helpers.arrayElement(users);

      const Comment = new comment({
        content: faker.lorem.paragraph(),
        author: author._id,
        createdAt: faker.date.recent(),
        post: Post._id,
      });
      await Comment.save();

      Post.comments.push({ comment: Comment._id });
      await Post.save();
    }

    console.log('✅ Mock data generated!');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

generateMockData();
