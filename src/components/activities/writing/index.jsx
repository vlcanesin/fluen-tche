import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './index.css';

const WritingQuestion = ({ data }) => {
    const { statement, answers } = data;

    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const parsedAnswers = answers.map((answers) => answers.toLowerCase())

    const handleChange = (event) => {
        setUserAnswer(event.target.value);
    };

    const handleSubmit = () => {
        if (parsedAnswers.includes(userAnswer.trim().toLowerCase())) {
            setIsCorrect(true);
            setFeedback('Correct!');
        } else {
            setIsCorrect(false);
            setFeedback(`Incorrect! The correct answer is: ${answers[0]}`);
        }
    };

    return (
        <div className="question-container">
            <div className="question-statement">
                {statement}
            </div>
            <input
                type="text"
                value={userAnswer}
                onChange={handleChange}
                className="answer-input"
            />
            <button className="confirm-button" onClick={handleSubmit}>
                Confirm Answer
            </button>
            {feedback && (
                <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {feedback}
                </div>
            )}
        </div>
    );
};

WritingQuestion.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.number.isRequired,
        statement: PropTypes.string.isRequired,
        answers: PropTypes.arrayOf(PropTypes.string).isRequired,
        correct_choice: PropTypes.number.isRequired,
        random_order: PropTypes.bool.isRequired,
    }).isRequired,
};

export default WritingQuestion;