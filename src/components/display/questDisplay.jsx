import React from "react";
import { useAuth } from "../../contexts/authContext";
import './questDisplay.css';
import useLikeDislike from "../utils/likedislike";
import { QuestionnaireData } from "../../firebase/firestore/questionnaire";
import { generateDBHandle } from "../../firebase/firestore/user";
import { FaThumbsUp } from '@react-icons/all-files/fa/FaThumbsUp';
import { FaThumbsDown } from '@react-icons/all-files/fa/FaThumbsDown';

const QuestDisplay = ({ quest, index, onDelete }) => {
    const { currentUser } = useAuth();
    const data = new QuestionnaireData(quest.data);

    const { hasLiked, hasDisliked, handleLike, handleDislike } = useLikeDislike(currentUser, data.meta.url);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this questionnaire?")) {
            try {
                await onDelete(data.meta.url);
            } catch (error) {
                console.error("Error deleting the questionnaire:", error);
            }
        }
    };

    return (
        <li key={index} className="questionnaire-item">
            <div className="questionnaire-details">
                <span className="questionnaire-title">{quest.data.name || "Untitled Questionnaire"}</span>
                <div className="questionnaire-info">
                    <span className="questionnaire-author">Author: {quest.data.meta.author || "N/A"}</span>
                    <span className="questionnaire-date">Date: {quest.data.meta.date ? new Date(quest.data.meta.date.toDate()).toLocaleDateString() : "N/A"}</span>
                    <span className="questionnaire-tags">Tags: {quest.data.meta.tags && quest.data.meta.tags.length > 0 ? quest.data.meta.tags.join(", ") : "N/A"}</span>
                </div>
            </div>
            <div className="questionnaire-actions">
                <button onClick={() => window.open(`/questionnaire/${quest.data.meta.url}`, "_blank")}>Open</button>
                {
                    generateDBHandle(currentUser) === quest.data.meta.author &&
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                }
            </div>
            <div className="like-dislike-buttons">
                <button 
                    onClick={() => handleLike(data)} 
                    className={`like-button ${hasLiked ? 'liked' : ''}`}
                >
                    <FaThumbsUp /> {data.meta.n_likes || 0}
                </button>
                <button 
                    onClick={() => handleDislike(data)} 
                    className={`dislike-button ${hasDisliked ? 'disliked' : ''}`}
                >
                    <FaThumbsDown /> {data.meta.n_dislikes || 0}
                </button>
            </div>
        </li>
    );
};

export default QuestDisplay;
