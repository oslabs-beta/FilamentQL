const mongoose = require("mongoose");
const { Schema } = mongoose;

const memberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  github: {
    type: String,
    required: true,
  },
  linkedIn: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("member", memberSchema);
