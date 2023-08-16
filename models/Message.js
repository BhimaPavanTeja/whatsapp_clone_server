const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  fromUid: {
    type: String,
    required: true,
  },
  toUid: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  files: {
    type: Array,
    default: [],
  }, // file urls
  seen: {
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.model("MESSAGE", messageSchema);

module.exports = Message;
