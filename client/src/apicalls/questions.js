import { axiosInstance } from ".";

// Add a new question
export const AddNewquestion = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/questions/add-question", payload);
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
};

// Get all questions
export const GetAllquestions = async () => {
  try {
    const response = await axiosInstance.get("/api/questions/get-all-questions");
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
};

// Get question by id
export const GetquestionById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/questions/get-question-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
};

// Update question
export const Updatequestion = async (payload) => {
  try {
    const response = await axiosInstance.put(
      `/api/questions/update-question/${payload._id}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
};

// delete question
export const Deletequestion = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/questions/delete-question/${id}`);
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
};

// get all questions by user
export const GetAllquestionsByUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/questions/get-all-questions-by-user"
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
}

// get all questions by liked by user;
export const GetAllquestionsByLikedByUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/questions/get-all-questions-by-liked-by-user"
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
}

// get all questions by commented by user
export const GetAllquestionsByCommentedByUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/questions/get-all-questions-by-commented-by-user"
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
}

// get all questions by shared by user
export const GetAllquestionsBySharedByUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/questions/get-all-questions-by-shared-by-user"
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
}

// get all questions by shared to user
export const GetAllquestionsBySharedToUser = async () => {
  try {
    const response = await axiosInstance.get(
      "/api/questions/get-all-questions-by-shared-to-user"
    );
    return response.data;
  } catch (error) {
    throw error || error.response.data;
  }
}