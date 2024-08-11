import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { 
    generateDBHandle, updateDBUserData, UserData 
} from "../../firebase/firestore/user";
import { 
    createDefaultDBQuestionnaire, updateDBQuestionnaire, fetchDBQuestionnaire, listDBQuestionnaire, QuestionnaireData, deleteDBQuestionnaire
} from "../../firebase/firestore/questionnaire";

const Home = () => {
    const { currentUser } = useAuth(); // Obtém o usuário atual do contexto de autenticação
    const [userInDB, setUserInDB] = useState(null); // Estado para armazenar dados do usuário
    const [newQuestUrl, setNewQuestUrl] = useState(null); // Estado para armazenar a URL do novo questionário
    const [questData, setQuestData] = useState({ title: "", language: "", questions: [] }); // Estado para armazenar dados do questionário
    const [listQuestData, setListQuestData] = useState([]); // Estado para armazenar a lista de questionários

    useEffect(() => {
        const updateUser = async () => {           
            if (currentUser) {
                const userHandle = generateDBHandle(currentUser);
                const userData = new UserData(currentUser.email, userHandle);
                await updateDBUserData(currentUser, userData);
                setUserInDB(userData.toJSON()); // Atualiza os dados do usuário no estado
            }
        };
        updateUser(); // Chama a função para atualizar os dados do usuário
    }, [currentUser]);

    // Função para criar um novo questionário
    const createQuestionnaire = async () => {
        const questUrl = await createDefaultDBQuestionnaire(); // Cria um novo questionário e obtém sua URL
        setNewQuestUrl(questUrl); // Define a URL do novo questionário no estado
        setQuestData({ title: "", language: "", questions: [] }); // Reseta os dados do questionário
    };

    // Função para atualizar o questionário
    const updateQuestionnaire = async () => {
        if (newQuestUrl && questData.title && questData.language) {
            const questionnaireData = new QuestionnaireData(
                questData.title, questData.language, questData.questions, {}
            );
            // Define os metadados do questionário
            questionnaireData.setMeta(generateDBHandle(currentUser), new Date().toISOString(), 0, 0, [], true, newQuestUrl);
            await updateDBQuestionnaire(newQuestUrl, questionnaireData); // Atualiza o questionário no banco de dados
            const fetchedQuest = await fetchDBQuestionnaire(newQuestUrl);
            setQuestData(fetchedQuest.data); // Atualiza os dados do questionário com os dados do banco
        }
    };

    // Função para listar todos os questionários
    const listQuestionnaires = async () => {
        try {
            const listedQuests = await listDBQuestionnaire(); // Obtém todos os questionários
            setListQuestData(listedQuests); // Atualiza o estado com a lista de questionários
        } catch (error) {
            console.error("Error fetching questionnaires: ", error);
        }
    };    

    // Função para manipular alterações nos campos do formulário
    const handleInputChange = (event, field) => {
        setQuestData({ ...questData, [field]: event.target.value });
    };

    // Função para adicionar uma nova pergunta ao questionário
    const handleAddQuestion = () => {
        setQuestData({
            ...questData,
            questions: [...questData.questions, { type: "MULTIPLA_ESCOLHA", text: "", options: [""] }]
        });
    };

    // Função para manipular alterações em uma pergunta específica
    const handleQuestionChange = (event, index, field) => {
        const questions = [...questData.questions];
        questions[index][field] = event.target.value;
        setQuestData({ ...questData, questions });
    };

    // Função para manipular alterações nas opções de uma pergunta
    const handleOptionChange = (event, qIndex, oIndex) => {
        const questions = [...questData.questions];
        questions[qIndex].options[oIndex] = event.target.value;
        setQuestData({ ...questData, questions });
    };

    // Função para salvar o questionário
    const handleSave = () => {
        updateQuestionnaire();
    };

    // Função para descartar as alterações do questionário
    const handleDiscard = () => {
        setQuestData({ title: "", language: "", questions: [] });
        setNewQuestUrl(null);
    };

    // Função para deletar um questionário
    const handleDelete = async (url) => {
        try {
            await deleteDBQuestionnaire(url); // Deleta o questionário do banco de dados
            // Atualiza a lista de questionários após a deleção
            const updatedList = listQuestData.filter(quest => quest.data.meta.url !== url);
            setListQuestData(updatedList); // Atualiza o estado com a lista filtrada
            alert("Questionário deletado com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar o questionário:", error);
        }
    };

    return (
        <div className="container">
            <h1>Bem vindo, {currentUser?.displayName || currentUser?.email}!</h1>
            {userInDB && <div className="user-info"><pre>{JSON.stringify(userInDB, null, 2)}</pre></div>}

            <div className="buttons">
                <button onClick={createQuestionnaire}>Create New Questionnaire</button>
                <button onClick={listQuestionnaires}>List Questionnaires</button>
            </div>

            {newQuestUrl && (
                <div className="questionnaire-form">
                    <h2>Create/Update Questionnaire</h2>
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={questData.title} 
                        onChange={(e) => handleInputChange(e, "title")} 
                    />
                    <input 
                        type="text" 
                        placeholder="Language" 
                        value={questData.language} 
                        onChange={(e) => handleInputChange(e, "language")} 
                    />
                    {questData.questions.map((question, index) => (
                        <div key={index} className="question-block">
                            <input 
                                type="text" 
                                placeholder="Question Text" 
                                value={question.text} 
                                onChange={(e) => handleQuestionChange(e, index, "text")} 
                            />
                            {question.options.map((option, oIndex) => (
                                <input 
                                    key={oIndex} 
                                    type="text" 
                                    placeholder={`Option ${oIndex + 1}`} 
                                    value={option} 
                                    onChange={(e) => handleOptionChange(e, index, oIndex)} 
                                />
                            ))}
                        </div>
                    ))}
                    <button onClick={handleAddQuestion}>Add Question</button>
                    <div className="form-actions">
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleDiscard}>Discard</button>
                    </div>
                </div>
            )}

            {listQuestData && listQuestData.length > 0 ? (
                <div className="questionnaires-list">
                    <h2>Questionnaires List</h2>
                    <ul>
                        {listQuestData.map((quest, index) => (
                            <div key={index}>
                                <a href={`/questionnaire/${quest.data.meta.url}`}>{quest.data.name || "Untitled Questionnaire"}</a>
                                <button onClick={() => handleDelete(quest.data.meta.url)}>Deletar</button>
                            </div>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No questionnaires found.</p>
            )}
        </div>
    );
};

export default Home;
