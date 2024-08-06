import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './index.css'; // Make sure to create a corresponding CSS file

const MultipleChoiceQuestion = ({ data }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const { statement, answers, correct_choice, random_order } = data;

    const shuffledAnswers = random_order ? [...answers].sort(() => Math.random() - 0.5) : answers;

    const handleChange = (e) => {
        setSelectedAnswer(parseInt(e.target.value, 10));
    };

    return (
        <div className="question-container">
            <div className="question-statement">
                {statement}
            </div>
            <div className="answers">
                {shuffledAnswers.map((answer, index) => (
                    <label key={index} className="answer-option">
                        <input 
                            type="radio" 
                            name="answer" 
                            value={index} 
                            checked={selectedAnswer === index} 
                            onChange={handleChange} 
                        />
                        {answer}
                    </label>
                ))}
            </div>
            <button className="confirm-button" onClick={() => alert(selectedAnswer === correct_choice ? 'Correct!' : 'Incorrect')}>
                Confirmar Resposta
            </button>
        </div>
    );
};

MultipleChoiceQuestion.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.number.isRequired,
        statement: PropTypes.string.isRequired,
        answers: PropTypes.arrayOf(PropTypes.string).isRequired,
        correct_choice: PropTypes.number.isRequired,
        random_order: PropTypes.bool.isRequired,
    }).isRequired,
};

export default MultipleChoiceQuestion;