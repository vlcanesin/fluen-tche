import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/authContext";
import { 
    fetchDBUser,
    generateDBHandle, createDefaultDBUser
} from "../../firebase/firestore/user";
import { 
    listDBQuestionnaire, deleteDBQuestionnaire, searchQuestionnaires
} from "../../firebase/firestore/questionnaire";
import QuestDisplay from "../display/questDisplay";
import { useNavigate } from 'react-router-dom';
import './index.css'

const Home = () => {
    const { currentUser } = useAuth();
    const [listQuest, setListQuestData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const updateUserCalled = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        const updateUser = async () => {
            if (currentUser && !updateUserCalled.current) {
                updateUserCalled.current = true; // Set to true to prevent future calls
                const userHandle = generateDBHandle(currentUser);
                let fetchedUser = await fetchDBUser(userHandle);
    
                // Only create the user if they don't exist
                if (!fetchedUser) {
                    //await new Promise(resolve => setTimeout(resolve, 500));
                    await createDefaultDBUser(currentUser);
                    fetchedUser = await fetchDBUser(userHandle);
                }
            }
        };
        updateUser();
    }, [currentUser]);

    const listQuestionnaires = async () => {
        try {
            const listedQuests = await listDBQuestionnaire();
            setListQuestData(listedQuests);
        } catch (error) {
            console.error("Error fetching questionnaires: ", error);
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
            listQuestionnaires();
        }
    };

    const handleDelete = async (url) => {
        try {
            await deleteDBQuestionnaire(url);
            setListQuestData(prevList => prevList.filter(quest => quest.data.meta.url !== url));
            alert("Questionnaire deleted successfully!");
        } catch (error) {
            console.error("Error deleting the questionnaire:", error);
        }
    };

    useEffect(() => {
        handleSearch();
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
                            <QuestDisplay
                                key={index}
                                quest={quest}
                                index={index}
                                onDelete={handleDelete}
                            />
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
