import { collection, addDoc, getDocs, doc, updateDoc, query, where, Timestamp } from "firebase/firestore"; 
import { db } from "../firebase";
import { v4 as uuidv4 } from 'uuid';
import languageEnum from "./enums";

// Estrutura pode mudar
class QuestionnaireData {
    constructor(name, language, questions, meta) {
        this.name = name || "";
        this.language = language || 1;
        this.questions = questions || [];
        this.meta = meta || {
            author: "",
            date: Timestamp.fromDate(new Date()),
            n_likes: 0,
            n_dislikes: 0,
            tags: [],
            visible: false,
            url: ""
        };
    }

    // Method to add a question
    addQuestion(type, statement, answers, correct_choice, random_order) {
        const question = {
            type: type || 1,
            statement: statement || "",
            answers: answers || [],
            correct_choice: correct_choice || 0,
            random_order: random_order || false
        };
        this.questions.push(question);
    }

    // Method to set metadata
    setMeta(author, date, n_likes, n_dislikes, tags, visible, url) {
        this.meta = {
            author: author || "",
            date: Timestamp.fromDate(new Date(date)) || Timestamp.fromDate(new Date()),
            n_likes: n_likes || 0,
            n_dislikes: n_dislikes || 0,
            tags: tags || [],
            visible: visible || false,
            url: url || ""
        };
    }

    // Method to convert class instance to JSON
    toJSON() {
        return {
            name: this.name,
            language: this.language,
            questions: this.questions,
            meta: this.meta
        };
    }
}

async function createDefaultDBQuestionnaire() {
    const reference = collection(db, "questionnaires");
    const uniqueUrl = uuidv4();
    const newQuestionnaire = new QuestionnaireData(
        "", 1, [],
        {
            author: "",
            date: "",
            n_likes: 0,
            n_dislikes: 0,
            tags: [],
            visible: false,
            url: uniqueUrl
        }
    );

    try {
        await addDoc(reference, newQuestionnaire.toJSON());
        console.log("Questionnaire added to Firestore:", uniqueUrl);
        return uniqueUrl;
    } catch (error) {
        console.error("Error adding questionnaire to Firestore:", error);
    }
}

async function updateDBQuestionnaire(url, questionnaireData) {
    const dbQuestionnaire = await fetchDBQuestionnaire(url);

    if(!dbQuestionnaire) {
        throw new Error('URL de questionario invalida');
    } else {
        try {
            const questRef = doc(db, "questionnaires", dbQuestionnaire.id);
            await updateDoc(questRef, questionnaireData.toJSON());
            console.log("Questionnaire data updated:", url);
        } catch (error) {
            console.error("Error updating questionnaire data:", error);
        }
    }
}

async function fetchDBQuestionnaire(url) {
    const reference = collection(db, "questionnaires");
    const q = query(reference, where("meta.url", "==", url));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        } else {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, data: doc.data() };
        }
    } catch (error) {
        console.error("Error fetching questionnaire:", error);
    }
}

export { QuestionnaireData, createDefaultDBQuestionnaire, updateDBQuestionnaire, fetchDBQuestionnaire }