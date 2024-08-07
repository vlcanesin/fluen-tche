import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { languageEnum, qtypeEnum } from '../../firebase/firestore/enums.js'; // import your enums
import MultipleChoiceQuestion from './multiple_choice/index.jsx';
import AssociationQuestion from './association/index.jsx';
import WritingQuestion from './writing/index.jsx';
import './qwrapper.css';

const QuestionTypeComponentMap = {
    [qtypeEnum.Questions.MULTIPLA_ESCOLHA]: MultipleChoiceQuestion,
    [qtypeEnum.Questions.ASSOCIACAO]: AssociationQuestion,
    [qtypeEnum.Questions.ESCRITA]: WritingQuestion,
};

const QuestionnaireWrapper = ({ data }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const { name, language, questions, meta } = data;
    const totalQuestions = questions.length;
    const currentQuestion = questions[currentQuestionIndex];
    const QuestionComponent = QuestionTypeComponentMap[currentQuestion.type];

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <div className="questionnaire-wrapper">
            <header>
                <h1>{name}</h1>
                <div className="questionnaire-meta">
                    <span className="language">
                        {languageEnum.getEmojiByNumber(language)} {languageEnum.decode(language)}
                    </span>
                    <span className="question-index">
                        {currentQuestionIndex + 1} / {totalQuestions}
                    </span>
                </div>
            </header>
            <div className="question-container">
                {QuestionComponent && <QuestionComponent data={currentQuestion} />}
            </div>
            <div className="navigation-buttons">
                <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    &lt; Previous
                </button>
                <button onClick={handleNext} disabled={currentQuestionIndex === totalQuestions - 1}>
                    Next &gt;
                </button>
            </div>
        </div>
    );
};

QuestionnaireWrapper.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        language: PropTypes.number.isRequired,
        questions: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.number.isRequired,
                statement: PropTypes.string.isRequired,
                answers: PropTypes.array.isRequired,
                correct_choice: PropTypes.number.isRequired,
                random_order: PropTypes.bool.isRequired,
            })
        ).isRequired,
        meta: PropTypes.shape({
            author: PropTypes.string,
            date: PropTypes.string,
            n_likes: PropTypes.number,
            n_dislikes: PropTypes.number,
            tags: PropTypes.arrayOf(PropTypes.string),
            visible: PropTypes.bool,
            url: PropTypes.string,
        }).isRequired,
    }).isRequired,
};

export default QuestionnaireWrapper;