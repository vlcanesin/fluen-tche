import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import './endscreen.css'; // create a separate CSS file for styling
import { QuestionnaireData, updateDBQuestionnaire } from '../../firebase/firestore/questionnaire';

const EndScreen = ({ summary, data }) => {
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    
    const dataJSON = data.toJSON();

    const handleLike = async () => {
        setHasLiked(true);
        data.meta.n_likes += 1;
        await updateDBQuestionnaire(dataJSON.meta.url, data);
        console.log("Like processed");
    };

    const handleDislike = async () => {
        setHasDisliked(true);
        data.meta.n_dislikes += 1
        await updateDBQuestionnaire(dataJSON.meta.url, data);
        console.log("Dislike processed");
    };

    return (
        <div className="end-screen">
            <h2>Parabéns! O que achou desta atividade?</h2>
            <div className="like-dislike-buttons">
                <button onClick={handleLike} /*disabled={hasLiked || hasDisliked}*/>
                    Like
                </button>
                <button onClick={handleDislike} /*disabled={hasLiked || hasDisliked}*/>
                    Dislike
                </button>
            </div>
            <div className="home-button">
                <Link to="/">
                    <button>Go to Home</button>
                </Link>
            </div>
        </div>
    );
};

EndScreen.propTypes = {
    summary: PropTypes.arrayOf(
        PropTypes.shape({
            statement: PropTypes.string.isRequired,
            correct: PropTypes.bool.isRequired,
            answered: PropTypes.bool.isRequired,
        })
    ).isRequired,
    data: PropTypes.shape({
        meta: PropTypes.shape({
            url: PropTypes.string.isRequired,
            n_likes: PropTypes.number.isRequired,
            n_dislikes: PropTypes.number.isRequired,
        }).isRequired,
    }).isRequired,
};

export default EndScreen;
