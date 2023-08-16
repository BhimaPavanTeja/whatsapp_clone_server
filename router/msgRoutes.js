const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// *sending msg
router.post("/sendMessage", async (req, res) => {
  try {
    const { content, fromUid, toUid, filesArray } = req.body;

    const newMsg = new Message({
      content,
      fromUid,
      toUid,
      files: filesArray,
    });

    const sendMsg = await newMsg.save();

    res.status(201).json({ message: sendMsg });
  } catch (error) {
    console.log(error.message);
  }
});

// *get messages
router.get("/messages/:uid/:chatId", async (req, res) => {
  try {
    const { uid, chatId } = req.params;
    const msgs = await Message.find({
      $or: [
        { $and: [{ fromUid: uid }, { toUid: chatId }] },
        { $and: [{ fromUid: chatId }, { toUid: uid }] },
      ],
    });

    if (msgs) {
      res.json({ messages: msgs });
    }
  } catch (error) {
    console.log(error.message);
  }
});

// *search messages
router.post("/searchMessages", async (req, res) => {
  try {
    const { message, uid, chatId } = req.body;

    const msgs = await Message.find({
      $or: [
        {
          $and: [
            { fromUid: uid },
            { toUid: chatId },
            { content: { $regex: message, $options: "i" } },
          ],
        },
        {
          $and: [
            { fromUid: chatId },
            { toUid: uid },
            { content: { $regex: message, $options: "i" } },
          ],
        },
      ],
    });

    if (msgs) {
      res.json({ messages: msgs });
    }

    //
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/setSeen", async (req, res) => {
  try {
    const { uid, chatid } = req.body;
    console.log(uid, chatid);
    const result = await Message.updateMany(
      { fromUid: chatid, toUid: uid },
      { seen: true }
    );
    if (result) {
      res.json({ message: "Messages set to seen!" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
