const router = require("express").Router();
const question = require("../models/questionsModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Like = require("../models/likesModel");
const Comment = require("../models/commentsModel");
const Share = require("../models/sharesModel");

// add new question
router.post("/add-question", authMiddleware, async (req, res) => {
  try {
    const newquestion = new question(req.body);
    await newquestion.save();
    res.send({
      message: "question added successfully",
      data: newquestion,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get all questions
router.get("/get-all-questions", async (req, res) => {
  try {
    const questions = await question.find().populate("user").sort({ createdAt: -1 });
    res.send({
      message: "questions fetched successfully",
      data: questions,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get question by id
router.get("/get-question-by-id/:id", async (req, res) => {
  try {
    const Question = await question.findById(req.params.id).populate("user");
    res.send({
      message: "question fetched successfully",
      data: Question,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// update question
router.put("/update-question/:id", authMiddleware, async (req, res) => {
  try {
    await question.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      message: "question updated successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// delete question
router.delete("/delete-question/:id", authMiddleware, async (req, res) => {
  try {
    await question.findByIdAndDelete(req.params.id);
    res.send({
      message: "question deleted successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get all questions by user
router.get("/get-all-questions-by-user", authMiddleware, async (req, res) => {
  try {
    const questions = await question.find({ user: req.body.userId }).sort({
      createdAt: -1,
    });
    res.send({
      message: "questions fetched successfully",
      data: questions,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get all questions by liked by user
router.get(
  "/get-all-questions-by-liked-by-user",
  authMiddleware,
  async (req, res) => {
    try {
      const likes = await Like.find({ user: req.body.userId }).populate({
        path: "question",
        populate: {
          path: "user",
        },
      });
      res.send({
        message: "questions fetched successfully",
        data: likes,
        success: true,
      });
    } catch (error) {
      res.send({
        error: error.message,
        success: false,
      });
    }
  }
);

// get all questions by commented by user
router.get(
  "/get-all-questions-by-commented-by-user",
  authMiddleware,
  async (req, res) => {
    try {
      const questions = await Comment.find({
        user: req.body.userId,
      }).populate({
        path: "question",
        populate: {
          path: "user",
        },
      });
      res.send({
        message: "questions fetched successfully",
        data: questions,
        success: true,
      });
    } catch (error) {
      res.send({
        error: error.message,
        success: false,
      });
    }
  }
);

// get all questions by shared by user
router.get(
  "/get-all-questions-by-shared-by-user",
  authMiddleware,
  async (req, res) => {
    try {
      const questions = await Share.find({
        sender: req.body.userId,
      })
        .populate({
          path: "question",
          populate: {
            path: "user",
          },
        })
        .populate("receiver")
        .sort({ createdAt: -1 });
      res.send({
        message: "questions fetched successfully",
        data: questions,
        success: true,
      });
    } catch (error) {
      res.send({
        error: error.message,
        success: false,
      });
    }
  }
);

// get all questions by shared to user
router.get(
  "/get-all-questions-by-shared-to-user",
  authMiddleware,
  async (req, res) => {
    try {
      const questions = await Share.find({
        receiver: req.body.userId,
      })
        .populate({
          path: "question",
          populate: {
            path: "user",
          },
        })
        .populate("sender")
        .sort({ createdAt: -1 });
      res.send({
        message: "questions fetched successfully",
        data: questions,
        success: true,
      });
    } catch (error) {
      res.send({
        error: error.message,
        success: false,
      });
    }
  }
);
module.exports = router;
