import { axiosInstance } from ".";

// Like a question
export const Likequestion = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/question-actions/like-question",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Unlike a question
export const Unlikequestion = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/question-actions/unlike-question",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Get all likes of a question
export const GetAllLikesOfquestion = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/api/question-actions/get-all-likes-of-question/${id}`
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// add a comment
export const AddComment = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/question-actions/add-comment",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// get all comments of a question
export const GetAllCommentsOfquestion = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/api/question-actions/get-all-comments-of-question/${id}`
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// delete a comment
export const DeleteComment = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/question-actions/delete-comment",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// share a question
export const Sharequestion = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/question-actions/share-question",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

