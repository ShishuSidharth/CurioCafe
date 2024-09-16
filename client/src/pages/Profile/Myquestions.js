import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllquestionsByUser , Deletequestion} from "../../apicalls/questions";
import moment from "moment";

function Myquestions() {
  const [questions, setquestions] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllquestionsByUser();
      console.log(response.data);
      if (response.success) {
        setquestions(response.data);
      } else {
        toast.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const deletquestion = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await Deletequestion(id);
      if (response.success) {
        toast.success(response.message);
        getData();
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
      <div className='border overflow-scroll h-[85vh]' >
        <div className="grid grid-cols-3 bg-gray-200 p-5 navbar">
          <h1>Title</h1>
          <h1>Posted On</h1>
          <h1>Actions</h1>
        </div>

        <div className="grid grid-cols-3 gap-5 mt-5 p-5">
          {questions.map((question) => (
            <>
              <h1>{question.title}</h1>
              <h1>{moment(question.createdAt).format("DD-MM-YYYY HH:mm")}</h1>
              <div className="flex gap-2">
                <Button
                  title="Edit"
                  variant="primary-outlined"
                  onClick={() => navigate(`/edit-question/${question._id}`)}
                />
                <Button
                  title="Delete"
                  variant="primary-outlined"
                  onClick={() => deletquestion(question._id)}
                />
              </div>
              <div className="col-span-3">
                <hr />
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Myquestions;
