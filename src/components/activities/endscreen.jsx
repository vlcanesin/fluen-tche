import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from "../../contexts/authContext";
import { generateDBHandle, fetchDBUser, updateDBUserData, UserData } from "../../firebase/firestore/user";
import { updateDBQuestionnaire } from '../../firebase/firestore/questionnaire';
import './endscreen.css';

const EndScreen = ({ data }) => {
    const { currentUser } = useAuth();
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    const [fetchedUser, setFetchedUser] = useState(null); // Updated fetchedUser state

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (currentUser) {
                const userHandle = generateDBHandle(currentUser);
                const dbUser = await fetchDBUser(userHandle);
                setFetchedUser(dbUser);

                const historyItem = dbUser?.data.history.find(h => h.url === data.meta.url);

                if (historyItem) {
                    setHasLiked(historyItem.has_liked);
                    setHasDisliked(historyItem.has_disliked);
                }
            }
        };

        fetchUserHistory();
    }, [currentUser, data.meta.url]);

    const handleLike = async () => {
        if (!hasLiked && fetchedUser) {
            setHasLiked(true);
            data.meta.n_likes += 1;

            if (hasDisliked) {
                data.meta.n_dislikes -= 1;
                setHasDisliked(false);
            }

            // Update questionnaire in the database
            await updateDBQuestionnaire(data.meta.url, data);

            // Update user's history in the fetchedUser object
            const historyIndex = fetchedUser.data.history.findIndex(h => h.url === data.meta.url);

            if (historyIndex !== -1) {
                // Update existing history entry
                fetchedUser.data.history[historyIndex].has_liked = true;
                fetchedUser.data.history[historyIndex].has_disliked = false;
            } else {
                // Add new history entry
                fetchedUser.data.history.push({ url: data.meta.url, has_liked: true, has_disliked: false });
            }

            // Write the updated user data back to Firestore
            await updateDBUserData(currentUser, new UserData(fetchedUser.data));

            console.log("Like processed");
        }
    };

    const handleDislike = async () => {
        if (!hasDisliked && fetchedUser) {
            setHasDisliked(true);
            data.meta.n_dislikes += 1;

            if (hasLiked) {
                data.meta.n_likes -= 1;
                setHasLiked(false);
            }

            // Update questionnaire in the database
            await updateDBQuestionnaire(data.meta.url, data);

            // Update user's history in the fetchedUser object
            const historyIndex = fetchedUser.data.history.findIndex(h => h.url === data.meta.url);

            if (historyIndex !== -1) {
                // Update existing history entry
                fetchedUser.data.history[historyIndex].has_liked = false;
                fetchedUser.data.history[historyIndex].has_disliked = true;
            } else {
                // Add new history entry
                fetchedUser.data.history.push({ url: data.meta.url, has_liked: false, has_disliked: true });
            }

            // Write the updated user data back to Firestore
            await updateDBUserData(currentUser, new UserData(fetchedUser.data));

            console.log("Dislike processed");
        }
    };

    return (
        <div className="end-screen">
            <h2>Parabéns! O que achou desta atividade?</h2>
            <div className="like-dislike-buttons">
                <button onClick={handleLike} disabled={hasLiked}>
                    Like
                </button>
                <button onClick={handleDislike} disabled={hasDisliked}>
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

export default EndScreen;
