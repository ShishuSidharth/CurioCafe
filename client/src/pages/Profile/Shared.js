import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import {
  GetAllquestionsBySharedByUser,
} from "../../apicalls/questions";
import moment from "moment";

function Shared() {
  const [questions, setquestions] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllquestionsBySharedByUser();
      if (response.success) {
        setquestions(
          response.data.map((share) => {
            return {
              title: share.question.title,
              author: share.question.user.name,
              questionPostedOn: moment(share.question.createdAt).format(
                "DD-MM-YYYY HH:mm"
              ),
              sharedTo: share.receiver.name,
              sharedOn: moment(share.createdAt).format("DD-MM-YYYY HH:mm"),
              questionId: share.question._id,
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
        <div className="grid grid-cols-6 bg-gray-200 p-5 navbar">
          <h1>Title</h1>
          <h1>Author</h1>
          <h1>Posted On</h1>
          <h1>Shared To</h1>
          <h1>Shared On</h1>
          <h1>Actions</h1>
        </div>

        <div className="grid grid-cols-6 gap-5 mt-5 p-5">
          {questions.map((question) => (
            <>
              <h1>{question.title}</h1>
              <h1>{question.author}</h1>
              <h1>{question.questionPostedOn}</h1>
              <h1>{question.sharedTo}</h1>
              <h1>{question.sharedOn}</h1>
              <div className="flex gap-2">
                <Button
                  title="View"
                  variant="primary-outlined"
                  onClick={() => navigate(`/question-desc/${question.questionId}`)}
                />
              </div>
              <div className="col-span-6">
                <hr />
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shared;
