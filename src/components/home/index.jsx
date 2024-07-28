import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { generateDBHandle, fetchDBUser } from "../../firebase/firestore/user";
import { 
    QuestionnaireData, createDefaultDBQuestionnaire, updateDBQuestionnaire, fetchDBQuestionnaire
} from "../../firebase/firestore/questionnaire";
import {
    BlogPostData, createDefaultDBBlogPost, updateDBBlogPost, fetchDBBlogPost
} from "../../firebase/firestore/blogpost";
import { languageEnum, qtypeEnum } from "../../firebase/firestore/enums";

const Home = () => {
    const { currentUser } = useAuth();
    const [userInDB, setUserInDB] = useState(null);
    const [newQuestUrl, setNewQuestUrl] = useState(null);
    const [newBPUrl, setNewBPUrl] = useState(null);
    const [questData, setQuestData] = useState(null);
    const [bpData, setBpData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (currentUser) {
                const userHandle = generateDBHandle(currentUser);
                const fetchedUser = await fetchDBUser(userHandle);
                setUserInDB(fetchedUser.data);
            }
        };

        fetchUser();
    }, [currentUser]);

    const createData = async () => {
        const questUrl = await createDefaultDBQuestionnaire();
        setNewQuestUrl(questUrl);

        const bpUrl = await createDefaultDBBlogPost();
        setNewBPUrl(bpUrl);

        // Fetch the created data to display it
        const fetchedQuest = await fetchDBQuestionnaire(questUrl);
        setQuestData(fetchedQuest.data);

        const fetchedBp = await fetchDBBlogPost(bpUrl);
        setBpData(fetchedBp.data);
    };

    const updateData = async () => {
        const quest = new QuestionnaireData(
            "Um dia na praia", languageEnum.encode("PORTUGUES")
        );
        quest.addQuestion(
            qtypeEnum.encode("MULTIPLA_ESCOLHA"), "Qual animal abaixo é provável que seja encontrado na praia?",
            ["Camaleão", "Jacaré", "Caranguejo", "Tatu"], 2, false
        );
        quest.addQuestion(
            qtypeEnum.encode("ASSOCIACAO"), "Associe as palavras similares",
            ["Vento / Brisa", "Relaxar / Tranquilizar", "Litoral / Beira-mar", "Mar / Oceano"], 0, false
        );
        quest.setMeta(
            generateDBHandle(currentUser), "07-28-2024", 0, 0, ["#praia", "#animais"], true, newQuestUrl
        );

        await updateDBQuestionnaire(newQuestUrl, quest);

        const blogPost = new BlogPostData(
            "Uma Aventura na Praia", languageEnum.encode("PORTUGUES"), "# Um dia incrível na praia..."
        );
        blogPost.setMeta(
            generateDBHandle(currentUser), "07-28-2024", 0, 0, ["#praia", "#aventura"], true, newBPUrl
        );

        await updateDBBlogPost(newBPUrl, blogPost);

        // Fetch the created data to display it
        const fetchedQuest = await fetchDBQuestionnaire(newQuestUrl);
        setQuestData(fetchedQuest.data);

        const fetchedBp = await fetchDBBlogPost(newBPUrl);
        setBpData(fetchedBp.data);
    };

    return (
        <div>
            <h1>Bem vindo, {currentUser?.displayName || currentUser?.email}!</h1>
            {userInDB && (
                <div>
                    <p>Database User Info:</p>
                    <p>Display Name: {userInDB.displayName}</p>
                    <p>Email: {userInDB.email}</p>
                    <p>Handle: {userInDB.handle}</p>
                </div>
            )}
            <button onClick={createData}>Create Data</button>
            <button onClick={updateData}>Update Data</button>
            {questData && (
                <div>
                    <h2>Questionnaire Data:</h2>
                    <pre>{JSON.stringify(questData, null, 2)}</pre>
                </div>
            )}
            {bpData && (
                <div>
                    <h2>Blog Post Data:</h2>
                    <pre>{JSON.stringify(bpData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Home;