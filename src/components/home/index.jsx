import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { generateDBHandle, fetchDBUser } from "../../firebase/firestore/user";
import { 
    QuestionnaireData, createDefaultDBQuestionnaire, updateDBQuestionnaire, fetchDBQuestionnaire
} from "../../firebase/firestore/questionnaire";
import {
    BlogPostData, createDefaultDBBlogPost, updateDBBlogPost, fetchDBBlogPost
} from "../../firebase/firestore/blogpost";
import { 
    NotificationData, uploadDBNotification, fetchDBUserNotifications 
} from "../../firebase/firestore/notifications";

import { languageEnum, qtypeEnum } from "../../firebase/firestore/enums";

const Home = () => {
    const { currentUser } = useAuth();
    const [userInDB, setUserInDB] = useState(null);
    const [newQuestUrl, setNewQuestUrl] = useState(null);
    const [newBPUrl, setNewBPUrl] = useState(null);
    const [questData, setQuestData] = useState(null);
    const [bpData, setBpData] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            if (currentUser) {
                const userHandle = generateDBHandle(currentUser);
                const fetchedUser = await fetchDBUser(userHandle);
                setUserInDB(fetchedUser.data);
            
                // Fetch notifications for the current user
                const fetchedNotifications = await fetchDBUserNotifications(currentUser);
                setNotifications(fetchedNotifications);
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
        const questionnaireData = new QuestionnaireData(
            "Vocabulary: Going Shopping", 
            languageEnum.encode("INGLES"),
            [], {}
        )
        
        questionnaireData.addQuestion(
            qtypeEnum.encode("MULTIPLA_ESCOLHA"),
            "Jay went grocery shopping. Besides his weekly purchases, he also intends to buy stuff to prepare a birthday party for his mom. But first, his dinner for today. Which of the following is a list of items he can find at the produce section?",
            [
                'Beef, chicken, shrimp.',
                'Potato, lettuce, tomato.',
                'Bread, cake, oats.',
                'Cheese, milk, yogurt.'
            ],
            1,
            true 
        )
        
        questionnaireData.addQuestion(
            qtypeEnum.encode("ASSOCIACAO"),
            "Now to buy the supplies for the party! Associate each item Jay bought with a verb related to what he’ll do with that item.",
            [
                'Candles#Light',
                'Cake#Frost',
                'Balloons#Inflate',
                'Party Hats#Wear'
            ],
            1,
            true 
        )
        
        questionnaireData.addQuestion(
            qtypeEnum.encode("ESCRITA"),
            'Jay is now headed to checkout. The cashier asked him in Portuguese, “quantas caixas de leite você tem no total?" Translate their question to English so that Jay can understand it.',
            [
                'How many milk cartons do you have in total?'
            ],
            1,
            true 
        )

        questionnaireData.setMeta(
            generateDBHandle(currentUser), "07-28-2024", 0, 0, ["#shopping"], true, newQuestUrl
        );

        await updateDBQuestionnaire(newQuestUrl, questionnaireData);

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

    const handleUploadNotification = async () => {
        if (currentUser) {
            const notification = new NotificationData(
                generateDBHandle(currentUser), // sender
                generateDBHandle(currentUser), // receiver
                "https://example.com/icon.png", // icon URL
                "This is a test notification", // content
                "07-28-2024", // current date
                false, // is_read
                ""  // id is not set
            );

            notification.id = await uploadDBNotification(notification);

            // Update notifications state
            const fetchedNotifications = await fetchDBUserNotifications(currentUser);
            setNotifications(fetchedNotifications);
            console.log(notifications);
        }
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
            <button onClick={handleUploadNotification}>Upload Notification</button>
            {notifications && notifications.length > 0 && (
                <div>
                    <h2>Notifications:</h2>
                    {notifications.map((notification) => (
                        <div key={notification.id}>
                            <p>Sender: {notification.data.sender}</p>
                            <p>Receiver: {notification.data.receiver}</p>
                            <p>Icon: <img src={notification.data.icon} alt="icon" /></p>
                            <p>Content: {notification.data.content}</p>
                            <p>Date: {notification.data.date.toDate().toString()}</p>
                            <p>Read: {notification.data.is_read ? "Yes" : "No"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;