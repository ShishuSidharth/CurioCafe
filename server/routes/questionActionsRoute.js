const Like = require("../models/likesModel");
const Share = require("../models/sharesModel");
const Comment = require("../models/commentsModel");
const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const question = require("../models/questionsModel");
const Notification = require("../models/notificationsModel");

// like a question
router.post("/like-question", authMiddleware, async (req, res) => {
  try {
    // add new like to likes collection
    const newLike = new Like(req.body);
    await newLike.save();

    // increment likes count in question document
    await question.findByIdAndUpdate(req.body.question, {
      $inc: { likesCount: 1 },
    });

    // add notification to notifications collection
    const newNotification = new Notification(req.body.notificationPayload);
    await newNotification.save();

    res.send({
      message: "question liked successfully",
      data: newLike,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// unlike a question
router.post("/unlike-question", authMiddleware, async (req, res) => {
  try {
    // delete like from likes collection
    await Like.findOneAndDelete(req.body);

    // decrement likes count in question document
    await question.findByIdAndUpdate(req.body.question, {
      $inc: { likesCount: -1 },
    });

    // add notification to notifications collection
    const newNotification = new Notification(req.body.notificationPayload);
    await newNotification.save();

    res.send({
      message: "question unliked successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get all likes of a question
router.get("/get-all-likes-of-question/:id", async (req, res) => {
  try {
    const likes = await Like.find({ question: req.params.id }).populate("user");
    res.send({
      message: "Likes fetched successfully",
      data: likes,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// add a comment
router.post("/add-comment", authMiddleware, async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();

    // increment comments count in question document
    await question.findByIdAndUpdate(req.body.question, {
      $inc: { commentsCount: 1 },
    });

    // add notification to notifications collection
    const newNotification = new Notification(req.body.notificationPayload);
    await newNotification.save();

    res.send({
      message: "Answer added successfully",
      data: newComment,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// get all comments of a question
router.get("/get-all-comments-of-question/:id", async (req, res) => {
  try {
    const comments = await Comment.find({ question: req.params.id })
      .populate("user")
      .sort({ createdAt: -1 });
    res.send({
      message: "Answers fetched successfully",
      data: comments,
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// delete a comment
router.post("/delete-comment", authMiddleware, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.body.commentId);

    // decrement comments count in question document
    await question.findByIdAndUpdate(req.body.questionId, {
      $inc: { commentsCount: -1 },
    });

    res.send({
      message: "Answer deleted successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});

// share a question
router.post("/share-question", authMiddleware, async (req, res) => {
  try {
    const { selectedUsers, question, sender, senderName } = req.body;

    // share question to all selected users
    for (let i = 0; i < selectedUsers.length; i++) {
      const newShare = new Share({
        question,
        sender,
        receiver: selectedUsers[i],
      });
      await newShare.save();
    }

    // increment shares count in question document
    await question.findByIdAndUpdate(question, {
      $inc: { sharesCount: 1 },
    });

    // add notification to notifications collection

    for (let i = 0; i < selectedUsers.length; i++) {
      const newNotification = new Notification({
        user: selectedUsers[i],
        title: `${senderName} shared a question with you`,
        read: false,
        onClick: `/question-desc/${question._id}`,
      });
      await newNotification.save();
    }

    //add Notification to question creator database for share

    const newNotification = new Notification({
      user: question.user._id,
      title: `${senderName} shared your question`,
      read: false,
      onClick: `/question-desc/${question._id}`,
    });
    await newNotification.save();

    res.send({
      message: "question shared successfully",
      success: true,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
});
module.exports = router;
