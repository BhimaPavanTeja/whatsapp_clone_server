const express = require("express");
const router = express.Router();
const User = require("../models/User");

// *adding user details into mongoDB
router.post("/register", async (req, res) => {
  try {
    const { name, email, uid, displayPicture } = req.body;

    const userFound = await User.findOne({ uid });
    if (userFound) {
      return res.status(422).json({ error: "User already exists!" });
    } else {
      const newUser = new User({
        name,
        uid,
        email,
        displayPicture,
      });
      const registerUser = await newUser.save();

      res.status(201).json({ message: "User registered successfully!!" });
    }
  } catch (error) {
    console.log(`error occured : ${error.message}`);
  }
});

// *get displayName and displayPicture from uid and otherInfo
router.get("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    if (user) {
      res.status(201).json({
        displayPicture: user.displayPicture,
        displayName: user.name,
        uid: user.uid,
        user,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
});

// *search for users
router.get("/search/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const people = await User.find({ email: { $regex: email, $options: "i" } });

    if (people) {
      res.status(201).json({ people });
    }
  } catch (error) {
    console.log(error.message);
  }
});

// *get users friends
router.get("/friends/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });

    if (user) {
      res.json({ friends: user.friends });
    }
  } catch (error) {
    console.log(error.message);
  }
});

// *search within user friends
router.get("/searchFriend/:uid/:friendName", async (req, res) => {
  try {
    const { uid, friendName } = req.params;
    const user = await User.findOne({ uid });
    const friends = await User.find({
      name: { $regex: friendName, $options: "i" },
    });
    let userFriends = [];

    if (user) {
      friends.forEach((e) => {
        if (user.friends.includes(e.uid)) {
          userFriends.push(e.uid);
        }
      });
      res.json({ friends: userFriends });
    }
  } catch (error) {
    console.log(error.message);
  }
});

// *add friend/contact
router.post("/addContact", async (req, res) => {
  try {
    const { uid, friendId } = req.body;

    const addFriend = await User.findOne({ uid });
    const theFriend = await User.findOne({ uid: friendId });

    if (!addFriend) {
      return res.status(404).json({ error: "Something went wrong!" });
    }
    addFriend.friends.push(friendId);
    await addFriend.save();

    if (!theFriend) {
      return res.status(404).json({ error: "Something went wrong!" });
    }
    theFriend.friends.push(uid);
    await theFriend.save();

    return res
      .status(200)
      .json({ message: "friend added successfully", friendId: addFriend.uid });
  } catch (error) {
    console.log(`error occured : ${error.message}`);
  }
});

module.exports = router;
