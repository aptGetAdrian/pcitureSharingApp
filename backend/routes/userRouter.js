import express from "express";
import { getUser, getUserFriends, addRemoveFriend } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


// getting user info
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);


// updating user data
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);



export default router;

