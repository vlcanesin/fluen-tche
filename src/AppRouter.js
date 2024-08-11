import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/authContext';
import Login from './components/auth/login';
import Home from './components/home';
import Register from './components/auth/register';
import QuestionnaireWrapper from './components/activities/qwrapper';
import CreateQuestionnaire from './components/createQuest';

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { userLoggedIn } = useAuth(); // Access authentication status from context
    return userLoggedIn ? children : <Navigate to="/login" />; // Redirect if not logged in
};

// Main routing configuration
const AppRouter = () => (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
            path="/"
            element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            }
        />
        <Route
            path="/questionnaire/:url"
            element={<QuestionnaireWrapper />}
        />
        <Route
            path="/create"
            element={
                <ProtectedRoute>
                    <CreateQuestionnaire />
                </ProtectedRoute>
            }
        />
    </Routes>
);

export default AppRouter;