import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllquestionsByLikedByUser } from "../../apicalls/questions";
import moment from "moment";

function Liked() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllquestionsByLikedByUser();
      if (response.success) {
        setQuestions(
          response.data.map((like) => {
            // Ensure that 'like' and 'like.question' are defined
            // const question = like?.question || {};
            return {
              ...like.question,
              likedOn: like?.createdAt ? moment(like.createdAt).format("DD-MM-YYYY HH:mm") : "N/A",
              createdAt: like?.question?.createdAt ? moment(like.question.createdAt).format("DD-MM-YYYY HH:mm") : "N/A",
            };
          })
        );
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
  }, []);

  return (
    <div>
      <div className="border overflow-scroll h-[85vh]">
        <div className="grid grid-cols-5 bg-gray-200 p-5 navbar">
          <h1>Title</h1>
          <h1>Owner / Posted By</h1>
          <h1>Posted On</h1>
          <h1>Liked On</h1>
          <h1>Actions</h1>
        </div>

        <div className="mt-5 p-5">
          {questions.map((question, index) => (
            <React.Fragment key={question._id || index}>
              <div className="grid grid-cols-5 gap-5">
                <h1>{question.title || "Untitled"}</h1>
                <h1>{question.user?.name || "Unknown"}</h1>
                <h1>{question.createdAt || "N/A"}</h1>
                <h1>{question.likedOn || "N/A"}</h1>
                <div className="flex gap-2">
                  <Button
                    title="View"
                    variant="primary-outlined"
                    onClick={() => navigate(`/question-desc/${question._id}`)}
                  />
                </div>
              </div>
              <div className="col-span-5">
                <hr />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Liked;
