import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import './questDisplay.css';
import { generateDBHandle, fetchDBUser, updateDBUserData, UserData } from "../../firebase/firestore/user";
import { QuestionnaireData, updateDBQuestionnaire } from '../../firebase/firestore/questionnaire';

const QuestDisplay = ({ quest, index, onDelete }) => {
    const { currentUser } = useAuth();
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    const [fetchedUser, setFetchedUser] = useState(null);

    const data = new QuestionnaireData(quest.data);

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
        if (fetchedUser) {
            const newHasLiked = !hasLiked;
            const newHasDisliked = hasDisliked && newHasLiked ? false : hasDisliked;
            
            // Update likes/dislikes counts based on new state
            data.meta.n_likes += newHasLiked ? 1 : -1;
            if (newHasDisliked !== hasDisliked) data.meta.n_dislikes -= 1;

            setHasLiked(newHasLiked);
            setHasDisliked(newHasDisliked);

            // Update questionnaire in the database
            await updateDBQuestionnaire(data.meta.url, data);

            // Update user's history in the fetchedUser object
            const historyIndex = fetchedUser.data.history.findIndex(h => h.url === data.meta.url);
            if (historyIndex !== -1) {
                fetchedUser.data.history[historyIndex].has_liked = newHasLiked;
                fetchedUser.data.history[historyIndex].has_disliked = newHasDisliked;
            } else {
                fetchedUser.data.history.push({ url: data.meta.url, has_liked: newHasLiked, has_disliked: newHasDisliked });
            }

            // Write the updated user data back to Firestore
            await updateDBUserData(currentUser, new UserData(fetchedUser.data));

            console.log("Like processed");
        }
    };

    const handleDislike = async () => {
        if (fetchedUser) {
            const newHasDisliked = !hasDisliked;
            const newHasLiked = hasLiked && newHasDisliked ? false : hasLiked;

            // Update dislikes/likes counts based on new state
            data.meta.n_dislikes += newHasDisliked ? 1 : -1;
            if (newHasLiked !== hasLiked) data.meta.n_likes -= 1;

            setHasDisliked(newHasDisliked);
            setHasLiked(newHasLiked);

            // Update questionnaire in the database
            await updateDBQuestionnaire(data.meta.url, data);

            // Update user's history in the fetchedUser object
            const historyIndex = fetchedUser.data.history.findIndex(h => h.url === data.meta.url);
            if (historyIndex !== -1) {
                fetchedUser.data.history[historyIndex].has_liked = newHasLiked;
                fetchedUser.data.history[historyIndex].has_disliked = newHasDisliked;
            } else {
                fetchedUser.data.history.push({ url: data.meta.url, has_liked: newHasLiked, has_disliked: newHasDisliked });
            }

            // Write the updated user data back to Firestore
            await updateDBUserData(currentUser, new UserData(fetchedUser.data));

            console.log("Dislike processed");
        }
    };

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
                    <span className="questionnaire-likes">Likes: {data.meta.n_likes || 0}</span>
                    <span className="questionnaire-dislikes">Dislikes: {data.meta.n_dislikes || 0}</span>
                </div>
            </div>
            <div className="like-dislike-buttons">
                <button onClick={handleLike}>
                    Like
                </button>
                <button onClick={handleDislike}>
                    Dislike
                </button>
            </div>
            <div className="questionnaire-actions">
                <button onClick={() => window.open(`/questionnaire/${quest.data.meta.url}`, "_blank")}>Open</button>
                {
                    generateDBHandle(currentUser) === quest.data.meta.author &&
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                }
            </div>
        </li>
    );
};

export default QuestDisplay;
