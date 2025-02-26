import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AdminPage from "./components/AdminPage";
import HomePage from "./components/HomePage";
import VideosPage from "./components/VideosPage";
import CategoriesPage from "./components/CategoriesPage";
import ExercisesPage from "./components/ExercisesPage";
import ArticlePage from "./components/ArticlePage";
import AdminExercisesPage from "./components/AdminExercisesPage";
import AdminUsersPage from "./components/AdminUsersPage";
import EditExercisePage from "./components/EditExercisePage";
import PlaygroundPage from "./components/PlaygroundPage";
import ScoresPage from "./components/ScoresPage";
import CertificatePage from "./components/CertificatePage";
import MeetingDetailsPage from "./components/MeetingDetailsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* เปลี่ยนเส้นทางหน้าแรกไปยังหน้า Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/articles" element={<ArticlePage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/admin/exercises" element={<AdminExercisesPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/exercises/edit/:id" element={<EditExercisePage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/admin/score" element={<ScoresPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/meeting-details" element={<MeetingDetailsPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;