import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { 
    generateDBHandle, 
    updateDBUserData, 
    UserData 
} from "../../firebase/firestore/user";
import { 
    createDefaultDBQuestionnaire, 
    updateDBQuestionnaire, 
    fetchDBQuestionnaire, 
    QuestionnaireData 
} from "../../firebase/firestore/questionnaire";
import './index.css'; // Importa o CSS específico para estilização

const CreateQuestionnaire = () => {
    const { currentUser } = useAuth(); // Obtém o usuário atual do contexto de autenticação
    const [userInDB, setUserInDB] = useState(null); // Estado para armazenar dados do usuário no banco de dados
    const [newQuestUrl, setNewQuestUrl] = useState(null); // Estado para armazenar a URL do novo questionário
    const [questData, setQuestData] = useState({ title: "", language: "", questions: [] }); // Estado para armazenar dados do questionário sendo criado/atualizado

    // Efeito para atualizar os dados do usuário quando o usuário atual muda
    useEffect(() => {
        const updateUser = async () => {           
            if (currentUser) {
                const userHandle = generateDBHandle(currentUser); // Gera um identificador único para o usuário
                const userData = new UserData(currentUser.email, userHandle); // Cria um objeto UserData com o e-mail e identificador
                await updateDBUserData(currentUser, userData); // Atualiza os dados do usuário no banco de dados
                setUserInDB(userData.toJSON()); // Atualiza o estado com os dados do usuário
            }
        };
        updateUser();
    }, [currentUser]);

    // Função para criar um novo questionário e definir a URL do questionário criado
    const createQuestionnaire = async () => {
        const questUrl = await createDefaultDBQuestionnaire(); // Cria um questionário padrão no banco de dados e obtém sua URL
        setNewQuestUrl(questUrl); // Define a URL do novo questionário
        setQuestData({ title: "", language: "", questions: [] }); // Limpa os dados do questionário
    };

    // Função para atualizar o questionário existente
    const updateQuestionnaire = async () => {
        if (newQuestUrl && questData.title && questData.language) {
            const questionnaireData = new QuestionnaireData(
                questData.title, 
                questData.language, 
                questData.questions, 
                {}
            );
            questionnaireData.setMeta(
                generateDBHandle(currentUser), 
                new Date().toISOString(), 
                0, 
                0, 
                [], 
                true, 
                newQuestUrl
            ); // Define os metadados do questionário
            await updateDBQuestionnaire(newQuestUrl, questionnaireData); // Atualiza o questionário no banco de dados
            const fetchedQuest = await fetchDBQuestionnaire(newQuestUrl); // Obtém os dados mais recentes do questionário
            setQuestData(fetchedQuest.data); // Atualiza os dados do questionário com os dados mais recentes
        }
    };

    // Função para lidar com a mudança de entrada dos campos de texto do questionário
    const handleInputChange = (event, field) => {
        setQuestData({ ...questData, [field]: event.target.value }); // Atualiza o estado com base na entrada do usuário
    };

    // Função para adicionar uma nova pergunta ao questionário
    const handleAddQuestion = () => {
        setQuestData({
            ...questData,
            questions: [...questData.questions, { type: "MULTIPLA_ESCOLHA", text: "", options: [""] }]
        });
    };

    // Função para lidar com a mudança no texto das perguntas
    const handleQuestionChange = (event, index, field) => {
        const questions = [...questData.questions];
        questions[index][field] = event.target.value; // Atualiza o texto da pergunta específica
        setQuestData({ ...questData, questions });
    };

    // Função para lidar com a mudança nas opções das perguntas
    const handleOptionChange = (event, qIndex, oIndex) => {
        const questions = [...questData.questions];
        questions[qIndex].options[oIndex] = event.target.value; // Atualiza a opção específica da pergunta
        setQuestData({ ...questData, questions });
    };

    // Função para salvar as alterações no questionário
    const handleSave = () => {
        updateQuestionnaire(); // Chama a função para atualizar o questionário
    };

    // Função para descartar as alterações e limpar os dados do questionário
    const handleDiscard = () => {
        setQuestData({ title: "", language: "", questions: [] });
        setNewQuestUrl(null); // Limpa a URL do novo questionário
    };

    return (
        <div className="container">
            <h1>Create/Update Questionnaire</h1>
            <button onClick={createQuestionnaire}>Create New Questionnaire</button>
            {newQuestUrl && (
                <div className="questionnaire-form">
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
        </div>
    );
};

export default CreateQuestionnaire;
