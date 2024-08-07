import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/authContext'; 
import Login from './components/auth/login';
import Home from './components/home'; 
import MultipleChoiceQuestion from './components/activities/multiple_choice';
import Register from './components/auth/register';
import AssociationQuestion from './components/activities/association';
import WritingQuestion from './components/activities/writing';
import QuestionnaireWrapper from './components/activities/qwrapper';
import { languageEnum, qtypeEnum } from './firebase/firestore/enums';
import { QuestionnaireData } from './firebase/firestore/questionnaire';


// Protected route component
const ProtectedRoute = ({ children }) => {
    const { userLoggedIn } = useAuth(); // Access authentication status from context
    return userLoggedIn ? children : <Navigate to="/login" />; // Redirect if not logged in
};

const questionnaireData = new QuestionnaireData(
    "Vocabulary: Going Shopping", 
    languageEnum.encode("INGLES"),
    [], {}
)

questionnaireData.addQuestion(
    qtypeEnum.encode("MULTIPLA_ESCOLHA"),
    "Jay went grocery shopping. Besides his weekly purchases, he also intends to buy stuff to prepare a birthday party for his mom. But first, his dinner for today. Which of the following is a list of items he can find at the produce section?",
    [
        'Beef, chicken, shrimp.',
        'Potato, lettuce, tomato.',
        'Bread, cake, oats.',
        'Cheese, milk, yogurt.'
    ],
    1,
    true 
)

questionnaireData.addQuestion(
    qtypeEnum.encode("ASSOCIACAO"),
    "Now to buy the supplies for the party! Associate each item Jay bought with a verb related to what he’ll do with that item.",
    [
        'Candles#Light',
        'Cake#Frost',
        'Balloons#Inflate',
        'Party Hats#Wear'
    ],
    1,
    true 
)

questionnaireData.addQuestion(
    qtypeEnum.encode("ESCRITA"),
    'Jay is now headed to checkout. The cashier asked him in Portuguese, “quantas caixas de leite você tem no total?" Translate their question to English so that Jay can understand it.',
    [
        'How many milk cartons do you have in total?'
    ],
    1,
    true 
)

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
                <QuestionnaireWrapper data={questionnaireData.toJSON()}/>
            }
        />
    </Routes>
);

export default AppRouter;