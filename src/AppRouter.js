import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/authContext'; 
import Login from './components/auth/login';
import Home from './components/home'; 
import MultipleChoiceQuestion from './components/activities/multiple_choice';
import Register from './components/auth/register';

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { userLoggedIn } = useAuth(); // Access authentication status from context
    return userLoggedIn ? children : <Navigate to="/login" />; // Redirect if not logged in
};

const questionData = {
    type: 1,
    statement: `Jay went grocery shopping. Besides his weekly purchases, he also intends to buy stuff to prepare a birthday party for his mom. But first, his dinner for today. Which of the following is a list of items he can find at the produce section?`,
    answers: [
        'Beef, chicken, shrimp.',
        'Potato, lettuce, tomato.',
        'Bread, cake, oats.',
        'Cheese, milk, yogurt.'
    ],
    correct_choice: 1,
    random_order: false
}

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
            path="/test_quest" 
            element={
                <MultipleChoiceQuestion data={questionData}/>
            }
        />
    </Routes>
);

export default AppRouter;