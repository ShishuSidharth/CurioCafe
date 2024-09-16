const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questions",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);


const likesModel = mongoose.model("likes", likesSchema);

module.exports = likesModel;