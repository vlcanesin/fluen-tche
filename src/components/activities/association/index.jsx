import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './index.css';

const AssociationQuestion = ({ data }) => {
    const { statement, answers, correct_choice, random_order } = data;

    const parsedAnswers = answers.map((answer, index) => {
        const [left, right] = answer.split('#');
        return [[left, index + 1], [right, index + 1]];
    });

    const [shuffledLeft, setShuffledLeft] = useState([]);
    const [shuffledRight, setShuffledRight] = useState([]);
    const [selectedLeft, setSelectedLeft] = useState(null);
    const [selectedRight, setSelectedRight] = useState(null);
    const [correctPairs, setCorrectPairs] = useState([]);
    const [incorrectPair, setIncorrectPair] = useState(false);

    useEffect(() => {
        if (random_order) {
            const leftColumn = [...parsedAnswers.map(pair => pair[0])].sort(() => Math.random() - 0.5);
            const rightColumn = [...parsedAnswers.map(pair => pair[1])].sort(() => Math.random() - 0.5);
            setShuffledLeft(leftColumn);
            setShuffledRight(rightColumn);
        } else {
            setShuffledLeft(parsedAnswers.map(pair => pair[0]));
            setShuffledRight(parsedAnswers.map(pair => pair[1]));
        }
    }, [data, random_order]);

    const checkPair = () => {
        if (selectedLeft !== null && selectedRight !== null) {
            const leftItem = shuffledLeft[selectedLeft];
            const rightItem = shuffledRight[selectedRight];

            if (leftItem[1] === rightItem[1]) {
                setCorrectPairs([...correctPairs, [leftItem, rightItem]]);
                setShuffledLeft(shuffledLeft.filter((_, i) => i !== selectedLeft));
                setShuffledRight(shuffledRight.filter((_, i) => i !== selectedRight));
            } else {
                setIncorrectPair(true);
                setTimeout(() => setIncorrectPair(false), 1000);
            }
            setSelectedLeft(null);
            setSelectedRight(null);
        }
    };

    return (
        <div className="question-container">
            <div className="question-statement">
                {statement}
            </div>
            <div className="answers">
                <div className="column">
                    {shuffledLeft.map((item, index) => (
                        <div
                            key={index}
                            className={`item ${selectedLeft === index ? 'selected' : ''}`}
                            onClick={() => setSelectedLeft(index)}
                        >
                            {item[0]}
                        </div>
                    ))}
                </div>
                <div className="column">
                    {shuffledRight.map((item, index) => (
                        <div
                            key={index}
                            className={`item ${selectedRight === index ? 'selected' : ''}`}
                            onClick={() => setSelectedRight(index)}
                        >
                            {item[0]}
                        </div>
                    ))}
                </div>
            </div>
            <button className="confirm-button" onClick={checkPair}>
                Confirm Answer
            </button>
            {incorrectPair && <div className="item incorrect">Incorrect Pair</div>}
            <div>
                {correctPairs.map((pair, index) => (
                    <div key={index} className="item correct">
                        {pair[0][0]} - {pair[1][0]}
                    </div>
                ))}
            </div>
        </div>
    );
};

AssociationQuestion.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.number.isRequired,
        statement: PropTypes.string.isRequired,
        answers: PropTypes.arrayOf(PropTypes.string).isRequired,
        correct_choice: PropTypes.number.isRequired,
        random_order: PropTypes.bool.isRequired,
    }).isRequired,
};

export default AssociationQuestion;