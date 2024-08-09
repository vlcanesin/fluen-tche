import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './index.css';

const WritingQuestion = ({ data, updateStatus }) => {
    const { statement, answers } = data;

    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const parsedAnswers = answers.map((answer) => answer.toLowerCase());

    const handleChange = (event) => {
        setUserAnswer(event.target.value);
    };

    const handleSubmit = () => {
        if (parsedAnswers.includes(userAnswer.trim().toLowerCase())) {
            setIsCorrect(true);
            setFeedback('Correct!');
            updateStatus('correct');
        } else {
            setIsCorrect(false);
            setFeedback(`Incorrect! The correct answer is: ${answers[0]}`);
            updateStatus('incorrect');
        }
    };

    // useEffect(() => {
    //     if (userAnswer.trim() === '') {
    //         updateStatus('unsolved');
    //     }
    // }, [userAnswer, updateStatus]);

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
    }).isRequired,
    updateStatus: PropTypes.func.isRequired,
};

export default WritingQuestion;