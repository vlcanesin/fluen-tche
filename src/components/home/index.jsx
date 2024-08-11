import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { 
    generateDBHandle, updateDBUserData, UserData 
} from "../../firebase/firestore/user";
import { 
    listDBQuestionnaire, deleteDBQuestionnaire
} from "../../firebase/firestore/questionnaire";
import { useNavigate } from 'react-router-dom';
import './index.css'

const Home = () => {
    const { currentUser } = useAuth(); // Obtém o usuário atual do contexto de autenticação
    const [listQuest, setListQuestData] = useState([]); // Armazena a lista de questionários
    const [showList, setShowList] = useState(false);  // Estado para controle da lista
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
            const listedQuests = await listDBQuestionnaire(); // Obtém todos os questionários
            setListQuestData(listedQuests); // Atualiza o estado com todos os questionários
        } catch (error) {
            console.error("Error fetching questionnaires: ", error);
        }
    };    

    const handleDelete = async (url) => {
        try {
          await deleteDBQuestionnaire(url); // Deleta o questionário do banco de dados
          // Atualiza a lista de questionários após a deleção
          const updatedList = listQuest.filter(quest => quest.data.meta.url !== url);
          setListQuestData(updatedList); // Corrigido para setListQuestData
          alert("Questionário deletado com sucesso!"); // Exibe mensagem de sucesso
        } catch (error) {
          console.error("Erro ao deletar o questionário:", error);
        }
    };    

    return (
        <div className="container">
            <h1>Bem-vindo, {currentUser?.displayName || currentUser?.email}!</h1>
    
            <div className="buttons">
                <button onClick={() => navigate('/create')}>Create New Questionnaire</button>
                <button onClick={() => { setShowList(!showList); if (!showList) listQuestionnaires(); }}>
                    {showList ? "Close List" : "List Questionnaires"}
                </button>
            </div>
    
            {showList && (
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
            )}
        </div>
    );
};

export default Home;
