import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllquestions } from "../../apicalls/questions";
import Question from "./question";

function Home() {
  const [questions, setquestions] = useState([]);
  const { currentUser } = useSelector((state) => state.usersReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllquestions();
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

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
    <img
          className="back w-full h-full bg-no-repeat bg-cover bg-left bg-fixed" 
          alt=""
          src="/images/Home.jpg"
        />
      <div className="flex justify-between navbar">
        <h1 className="text-primary uppercase text-2xl font-bold heading">
          Welcome {currentUser.name} !
        </h1>

        {/* <Button
          title="Add question"
          variant="primary-outlined"
          onClick={() => navigate("/add-question")}
        /> */}
        <button className="button-86 button-margin w-fit" onClick={() => navigate("/add-question")}>Add question</button>
      </div>

      <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-5 mt-5 sm:grid-cols-1 xs:grid-cols-1 overflow-scroll h-[85vh]">
        {questions.map((question) => (
          <Question key={question._id} question={question} />
        ))}
      </div>
    </div>
  );
}

export default Home;
