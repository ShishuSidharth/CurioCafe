import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";
import Loader from "./components/Loader";
import AddEditquestion from "./pages/AddEditquestion";
import QuestionDescription from "./pages/questionDesc";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";


function App() {
  const { loading } = useSelector((state) => state.loadersReducer);
  return (
    <div>
      {loading && <Loader />}
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-question"
            element={
              <ProtectedRoute>
                <AddEditquestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/question-desc/:id"
            element={
              <ProtectedRoute>
                <QuestionDescription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-question/:id"
            element={
              <ProtectedRoute>
                <AddEditquestion />
              </ProtectedRoute>
            }
          />
           <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
             <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
