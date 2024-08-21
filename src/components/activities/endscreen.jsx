import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../contexts/authContext";
import { FaThumbsUp } from '@react-icons/all-files/fa/FaThumbsUp';
import { FaThumbsDown } from '@react-icons/all-files/fa/FaThumbsDown';
import useLikeDislike from '../utils/likedislike';
import './endscreen.css';

const EndScreen = ({ data }) => {
    const { currentUser } = useAuth();
 
    const { hasLiked, hasDisliked, handleLike, handleDislike } = useLikeDislike(currentUser, data.meta.url);

    return (
        <div className="end-screen">
            <h2>Parabéns! O que achou desta atividade?</h2>
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
            <div className="home-button">
                <Link to="/">
                    <button>Go to Home</button>
                </Link>
            </div>
        </div>
    );
};

export default EndScreen;
