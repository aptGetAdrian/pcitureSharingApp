import user from "../models/userModel";


// getting user data
export const getUser = async (req, res) => {

    try {
        
        const {id} = req.params;

        const currentUser = await user.findById(id);

        res.status(200).json(user);

    } catch (err) {

        res.status(404).json({ message: err.message });


    }

}


// getting user friends
export const getUserFriends = async (req, res) => {

    try {
        
        const {id} = req.params;
        const currentUser = user.findById(id);



        const friends = await Promise.all(
            currentUser.friends.map((id) => user.findById(id))


        );


        const formattedFriends = friends.map (
            ({ _id, username, picturePath }) => {
                return { _id, username, picturePath };
            }


        );

        res.status(200).json(formattedFriends);


    } catch (err) {

        res.status(404).json({ message: err.message });


    }

    
}


// updating user friends

export const addRemoveFriend = async (req, res) => {

    try {
        
        const {id, friendId} = req.params;
        const currentUser = user.findById(id);
        const friend = user.findById(friendId);


        if (currentUser.friends.includes(friendId)) {
            currentUser.friends = currentUser.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            currentUser.friends.push(friendId);
            friend.friends.push(id);
        }

        await currentUser.save();
        await friend.save();


        const friends = await Promise.all(
            currentUser.friends.map((id) => user.findById(id))


        );


        const formattedFriends = friends.map (
            ({ _id, username, picturePath }) => {
                return { _id, username, picturePath };
            }


        );

        res.status(200).json(formattedFriends);

    } catch (err) {

        res.status(404).json({ message: err.message });


    }




}