import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { languageEnum, qtypeEnum } from '../../firebase/firestore/enums';
import MultipleChoiceQuestion from './multiple_choice';
import AssociationQuestion from './association';
import WritingQuestion from './writing';
import { fetchDBQuestionnaire } from '../../firebase/firestore/questionnaire';
import './qwrapper.css';

const QuestionTypeComponentMap = {
    [qtypeEnum.Questions.MULTIPLA_ESCOLHA]: MultipleChoiceQuestion,
    [qtypeEnum.Questions.ASSOCIACAO]: AssociationQuestion,
    [qtypeEnum.Questions.ESCRITA]: WritingQuestion,
};

const QuestionnaireWrapper = () => {
    const { url } = useParams();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await fetchDBQuestionnaire(url);
                setData(fetchedData.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>No data found</div>;
    }

    const { name, language, questions } = data;
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
    url: PropTypes.string.isRequired,
};

export default QuestionnaireWrapper;