import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRouter.js";
import userRoutes from "./routes/userRouter.js";
import postsRoutes from "./routes/postsRouter.js";
import { register } from "./controllers/authController.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import { createPost } from "./controllers/postsController.js";


// middleware config
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);


dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/images", express.static(path.join(dirName, "public/images")));


// file storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images"); // images always store into this folder
    },


    filename: function (req, file, cb) {
        cb(null, file.originalname); // images always save with their original filename
        
    }
});

const upload = multer({ storage }); // easy file upload setup


// routes with files (because i need the local upload object)
app.post("/auth/register", upload.single("picture"), register); 
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// other routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);

// database setup
const mongoDB = "mongodb://127.0.0.1/vaja4myProject";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




