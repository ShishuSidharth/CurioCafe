import React, { useEffect } from "react";
import "./../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AddNewquestion, GetquestionById, Updatequestion } from "../../apicalls/questions";
import { toast } from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { useNavigate, useParams } from "react-router-dom";

function AddEditquestion() {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.usersReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [question, setquestion] = React.useState({
    title: "",
    content: EditorState.createEmpty(),
    description: "",
    canShare: false,
    canComment: false,
    canLike: false,
  });

  const onSave = async () => {
    try {
      dispatch(ShowLoading());
      let response = null
      if(params.id)
      {
        response = await Updatequestion({
          ...question,
          content: JSON.stringify(convertToRaw(question.content.getCurrentContent())),
          user: currentUser._id,
          _id: params.id
        });
      }else{
        response = await AddNewquestion({
          ...question,
          content: JSON.stringify(convertToRaw(question.content.getCurrentContent())),
          user: currentUser._id,
        });
      }
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
      const response = await GetquestionById(params.id);
      if (response.success) {
        setquestion({
          ...response.data,
          content: EditorState.createWithContent(
            convertFromRaw(JSON.parse(response.data.content))
          ),
        });
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
    if(params.id)
    {
      getData();
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-primary uppercase text-2xl font-bold heading">
          {params.id ? "Edit question" : "Add New question"}
        </h1>
      </div>

      <div className="flex flex-col gap-5 mt-5 overflow-scroll h-[75vh]">
        <input
          type="text"
          placeholder="Title"
          value={question.title}
          onChange={(e) => setquestion({ ...question, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={question.description}
          onChange={(e) => setquestion({ ...question, description: e.target.value })}
          rows={4}
        />

        <div>
          <Editor
            toolbarStyle={{
              border: "1px solid #ccc",
              zIndex: 1000,
            }}
            editorStyle={{
              border: "1px solid #ccc",
              minHeight: "190px",
              padding: "10px",
              
            }}
            editorState={question.content}
            onEditorStateChange={(content) =>
              setquestion({ ...question, content: content })
            }
           
          />
        </div>

        <div className="flex gap-5">
          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={question.canShare}
              onChange={(e) => setquestion({ ...question, canShare: e.target.checked })}
            />

            <h1>Can Share ?</h1>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={question.canComment}
              onChange={(e) =>
                setquestion({ ...question, canComment: e.target.checked })
              }
            />

            <h1>Can Comment ?</h1>
          </div>

          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={question.canLike}
              onChange={(e) => setquestion({ ...question, canLike: e.target.checked })}
            />

            <h1>Can Like ?</h1>
          </div>
        </div>

        <div className="flex justify-end gap-5 button-margin">
          <Button title="Cancel" variant="primary-outlined" />
          <Button title="Save" onClick={onSave} />
        </div>
      </div>
    </div>
  );
}

export default AddEditquestion;
