import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import Lessons from "./pages/Lessons";
import Home from "./pages/Home";
import LessonQuestions from "./pages/Lessons/LessonQuestions";
import LessonPage from "./pages/User/LessonsPage";
import ExamPage from "./pages/User/ExamPage";
import ExamResultsPage from "./pages/User/ExamResultsPage";
import ExamHistoryPage from "./pages/User/ExamHistory";
import ExamHistoryAdminPage from "./pages/ExamHistory";

import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoutes";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="user/change-password"
            element={
              <ProtectedRoute role="user">
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="user/lessons"
            element={
              <ProtectedRoute role="user">
                <LessonPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="user/exam/:lessonId"
            element={
              <ProtectedRoute role="user">
                <ExamPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="user/exam/result/:resultId"
            element={
              <ProtectedRoute role="user">
                <ExamResultsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/exam/result/:resultId"
            element={
              <ProtectedRoute role="admin">
                <ExamResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="user/exam/history"
            element={
              <ProtectedRoute role="user">
                <ExamHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/change-password"
            element={
              <ProtectedRoute role="admin">
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/lessons"
            element={
              <ProtectedRoute role="admin">
                <Lessons />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/exam/history"
            element={
              <ProtectedRoute role="admin">
                <ExamHistoryAdminPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/lessons/:lessonId/questions"
            element={<LessonQuestions />}
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
