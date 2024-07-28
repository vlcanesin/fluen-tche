import { collection, addDoc, getDocs, doc, updateDoc, query, where, Timestamp } from "firebase/firestore"; 
import { db } from "../firebase";
import { generateDBHandle } from "./user";
import { v4 as uuidv4 } from 'uuid';

// Estrutura pode mudar
class NotificationData {
    constructor(sender, receiver, icon, content, date, is_read, id) {
        this.sender = sender || "";
        this.receiver = receiver || "";
        this.icon = icon || "";   // icon URL
        this.content = content || "";
        this.date = Timestamp.fromDate(new Date(date)) || Timestamp.fromDate(new Date());
        this.is_read = is_read || false;
        this.id = id;
    }

    // Method to convert class instance to JSON
    toJSON() {
        return {
            sender: this.sender,
            receiver: this.receiver,
            icon: this.icon,
            content: this.content,
            date: this.date,
            is_read: this.is_read,
            id: this.id
        };
    }
}

async function uploadDBNotification(notificationData) {
    const reference = collection(db, "notifications");
    const uniqueId = uuidv4();
    notificationData.id = uniqueId;

    try {
        await addDoc(reference, notificationData.toJSON());
        console.log("Notification uploaded to Firestore:", uniqueId);
        return uniqueId;
    } catch (error) {
        console.error("Error uploading notification to Firestore:", error);
    }
}

async function fetchDBUserNotifications(user) {
    const reference = collection(db, "notifications");
    const userHandle = generateDBHandle(user);
    const q = query(reference, where("receiver", "==", userHandle));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        } else {
            return querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
        }
    } catch (error) {
        console.error("Error fetching questionnaire:", error);
    }
}

export { NotificationData, uploadDBNotification, fetchDBUserNotifications }