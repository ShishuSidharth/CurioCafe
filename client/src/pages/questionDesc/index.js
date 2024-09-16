import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { Deletequestion, GetquestionById } from "../../apicalls/questions";
import ReactHtmlParser from "react-html-parser";
import draftToHtml from "draftjs-to-html";
import moment from "moment";
import {
  AddComment,
  GetAllCommentsOfquestion,
  GetAllLikesOfquestion,
  Likequestion,
  Unlikequestion,
} from "../../apicalls/questionActions";
import Comment from "./Comment";
import Share from "./Share";

function QuestionDescription() {
  const [comments, setComments] = useState([]);  // Correctly initialized
  const [showComments, setShowComments] = useState(true); 
  const [showShare, setShowShare] = useState(false); 
  const [showAddComment, setShowAddComment] = useState(false); 
  const [comment, setComment] = useState(""); // Correctly initialized
  const [isAlreadyLiked, setIsAlreadyLiked] = useState(false);
  const [question, setQuestion] = useState(null);
  const { currentUser, socket } = useSelector((state) => state.usersReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
console.log(id);
  const deletequestion = async () => {
    try {
      dispatch(ShowLoading());
      const response = await Deletequestion(id);
      if (response.success) {
        toast.success(response.message);
        navigate("/");
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetquestionById(id);
      
      const likesResponse = await GetAllLikesOfquestion(id);
      const commentsResponse = await GetAllCommentsOfquestion(id);
      if (likesResponse.success) {
        const isLiked = likesResponse.data.find(
          (like) => like.user._id === currentUser._id
        );
        setIsAlreadyLiked(isLiked);
      }
      if (commentsResponse.success) {
        setComments(commentsResponse.data);
      }

      if (response.success) {
        setQuestion(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
      console.log(response);
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const likeOrUnlike = async () => {
    try {
      dispatch(ShowLoading());
      let response = null;

      if (isAlreadyLiked) {
        socket.emit("newNotification", {
          userId: question?.user?._id,
          title: `${currentUser?.name} unliked your question ${question?.title}`,
        });

        response = await Unlikequestion({
          question: question?._id,
          user: currentUser._id,
          notificationPayload: {
            user: question?.user?._id,
            title: `${currentUser?.name} unliked your question ${question?.title}`,
            onClick: `/question-desc/${question?._id}`,
          },
        });
      } else {
        socket.emit("newNotification", {
          userId: question?.user?._id,
          title: `${currentUser?.name} liked your question ${question?.title}`,
        });

        response = await Likequestion({
          question: question?._id,
          user: currentUser._id,
          notificationPayload: {
            user: question?.user?._id,
            title: `${currentUser?.name} liked your question ${question?.title}`,
            onClick: `/question-desc/${question?._id}`,
          },
        });
      }
      if (response.success) {
        getData();
        setIsAlreadyLiked(!isAlreadyLiked);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const addComment = async () => {
    try {
      dispatch(ShowLoading());
      //
      socket.emit("newNotification", {
          userId: question?.user?._id,
          title: `${currentUser?.name} commented on your question ${question?.title}`,
        });
      //
      
      const response = await AddComment({
        question: question?._id,
        user: currentUser._id,
        comment,
        notificationPayload: {
          user: question?.user?._id,
          title: `${currentUser?.name} commented on your question ${question?.title}`,
          onClick: `/question-desc/${question?._id}`,
        },
      });
      if (response.success) {
        getData();
        setComment("");
        setShowAddComment(false);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    question && (
      <div className="p-2 flex flex-col gap-5 overflow-scroll h-[85vh]" >
        {currentUser?._id === question?.user?._id && (
          <div className="flex justify-end gap-5">
            <Button
              onClick={() => deletequestion()}
              title="Delete"
              variant="primary-outlined"
            />
            <Button
              onClick={() => navigate(`/edit-question/${question?._id}`)}
              title="Edit"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold text-primary">{question?.title}</h1>
        <hr />
        <h1>{question?.description}</h1>
        <div>{ReactHtmlParser(draftToHtml(JSON.parse(question?.content)))}</div>

        <hr />

        <div className="flex justify-between items-center">
          <div>
            <h1>Posted By: {question.user.name}</h1>
            <h1>
              Posted On : {moment(question.createdAt).format("DD-MM-YYYY hh:mm:ss")}
            </h1>
          </div>
          <div className="flex gap-5 items-center">
            <div
              className="flex gap-1 items-center cursor-pointer"
              onClick={likeOrUnlike}
            >
              <i
                className="ri-heart-fill"
                style={{ color: isAlreadyLiked ? "red" : "gray" }}
              ></i>
              <span>{question.likesCount}</span>
            </div>
            <div className="flex gap-1 items-center cursor-pointer">
              <i class="ri-chat-1-line"></i>
              <span>{question.commentsCount}</span>
            </div>
            <div
              className="flex gap-1 items-center cursor-pointer"
              onClick={() => {
                setShowShare(true);
                setShowComments(false);
              }}
            >
              <i class="ri-share-forward-line"></i>
              <span>{question.sharesCount}</span>
            </div>
          </div>
        </div>

        <div>
          {!showAddComment && !showShare && (
            <div className="flex justify-end underline cursor-pointer">
              <h1 onClick={() => setShowAddComment(!showAddComment)}>
                Add Answer
              </h1>
            </div>
          )}
          {showAddComment && (
            <div className="flex flex-col gap-5 shadow p-5 border">
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end gap-5">
                <Button
                  title="Cancel"
                  onClick={() => setShowAddComment(false)}
                  variant="primary-outlined"
                />
                <Button title="Add Answer" onClick={addComment} />
              </div>
            </div>
          )}

          {showComments && (
            <div className="flex flex-col gap-5 mt-5">
              {comments.map((comment) => (
                <Comment comment={comment} getData={getData} />
              ))}
            </div>
          )}

          {showShare && (
            <Share
              question={question}
              setShowShare={setShowShare}
              setShowComments={setShowComments}
              getData={getData}
            />
          )}
        </div>
      </div>
    )
  );
}

export default QuestionDescription;
