import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './index.css';

const MultipleChoiceQuestion = ({ data }) => {
    const { statement, answers, correct_choice, random_order } = data;

    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);

    useEffect(() => {
        const parsedAnswers = answers.map((answer, index) => ({
            answer,
            index,
        }));
        const shuffled = random_order ? parsedAnswers.sort(() => Math.random() - 0.5) : parsedAnswers;
        setShuffledAnswers(shuffled);
    }, [answers, random_order]);

    const handleOptionChange = (index) => {
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        const selectedAnswer = shuffledAnswers[selectedOption];
        if (selectedAnswer.index === correct_choice) {
            setIsCorrect(true);
            setFeedback('Correct!');
        } else {
            setIsCorrect(false);
            setFeedback(`Incorrect! The correct answer is: ${answers[correct_choice]}`);
        }
    };

    return (
        <div className="question-container">
            <div className="question-statement">
                {statement}
            </div>
            <div className="options-container">
                {shuffledAnswers.map((option, index) => (
                    <div
                        key={index}
                        className={`option ${selectedOption === index ? 'selected' : ''}`}
                        onClick={() => handleOptionChange(index)}
                    >
                        {option.answer}
                    </div>
                ))}
            </div>
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

MultipleChoiceQuestion.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.number.isRequired,
        statement: PropTypes.string.isRequired,
        answers: PropTypes.arrayOf(PropTypes.string).isRequired,
        correct_choice: PropTypes.number.isRequired,
        random_order: PropTypes.bool,
    }).isRequired,
};

export default MultipleChoiceQuestion;