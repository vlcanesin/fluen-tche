import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { 
    generateDBHandle, updateDBUserData, UserData 
} from "../../firebase/firestore/user";
import { 
    listDBQuestionnaire, deleteDBQuestionnaire, searchQuestionnaires
} from "../../firebase/firestore/questionnaire";
import { useNavigate } from 'react-router-dom';
import './index.css'

const Home = () => {
    const { currentUser } = useAuth(); // Get the current user from the authentication context
    const [listQuest, setListQuestData] = useState([]); // Store the list of questionnaires
    const [showList, setShowList] = useState(false);  // State for controlling the list
    const [searchTerm, setSearchTerm] = useState(""); // State for storing the search term
    const navigate = useNavigate();

    useEffect(() => {
        const updateUser = async () => {           
            if (currentUser) {
                const userHandle = generateDBHandle(currentUser);
                const userData = new UserData(currentUser.email, userHandle);
                await updateDBUserData(currentUser, userData);
            }
        };
        updateUser();
    }, [currentUser]);

    const listQuestionnaires = async () => {
        try {
            const listedQuests = await listDBQuestionnaire(); // Get all questionnaires
            setListQuestData(listedQuests); // Update state with all questionnaires
        } catch (error) {
            console.error("Error fetching questionnaires: ", error);
        }
    };

    const handleDelete = async (url) => {
        try {
            await deleteDBQuestionnaire(url); // Delete the questionnaire from the database
            // Update the list of questionnaires after deletion
            const updatedList = listQuest.filter(quest => quest.data.meta.url !== url);
            setListQuestData(updatedList); // Update state with the new list
            alert("Questionnaire deleted successfully!"); // Show success message
        } catch (error) {
            console.error("Error deleting the questionnaire:", error);
        }
    };

    const handleSearch = async () => {
        if (searchTerm.trim() !== "") {
            try {
                const results = await searchQuestionnaires(searchTerm.trim());
                setListQuestData(results);
            } catch (error) {
                console.error("Error searching for questionnaires:", error);
            }
        } else {
            const listedQuests = await listDBQuestionnaire(); // Get all questionnaires
            setListQuestData(listedQuests); // Update state with all questionnaires
        }
    };

    useEffect(() => {
        handleSearch(); // Trigger search whenever searchTerm changes
    }, [searchTerm]);

    return (
        <div className="container">
            <h1>Welcome, {currentUser?.displayName || currentUser?.email}!</h1>

            <div className="buttons">
                <button onClick={() => navigate('/create')}>Create New Questionnaire</button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search activities or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

                <div className="questionnaires-list">
                    <h2>Questionnaires List</h2>
                    {listQuest.length > 0 ? (
                        <ul>
                            {listQuest.map((quest, index) => (
                                <li key={index} className="questionnaire-item">
                                    <div className="questionnaire-details">
                                        <span className="questionnaire-title">{quest.data.name || "Untitled Questionnaire"}</span>
                                        <div className="questionnaire-info">
                                            <span className="questionnaire-author">Author: {quest.data.meta.author || "N/A"}</span>
                                            <span className="questionnaire-date">Date: {quest.data.meta.date ? new Date(quest.data.meta.date.toDate()).toLocaleDateString() : "N/A"}</span>
                                            <span className="questionnaire-tags">Tags: {quest.data.meta.tags && quest.data.meta.tags.length > 0 ? quest.data.meta.tags.join(", ") : "N/A"}</span>
                                            <span className="questionnaire-likes">Likes: {quest.data.meta.n_likes || 0}</span>
                                            <span className="questionnaire-dislikes">Dislikes: {quest.data.meta.n_dislikes || 0}</span>
                                        </div>
                                    </div>
                                    <div className="questionnaire-actions">
                                        <button onClick={() => window.open(`/questionnaire/${quest.data.meta.url}`, "_blank")}>Open</button>
                                        <button onClick={() => handleDelete(quest.data.meta.url)} className="delete-button">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No questionnaires found.</p>
                    )}
                </div>
        </div>
    );
};

export default Home;
