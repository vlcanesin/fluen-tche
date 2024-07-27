import { collection, addDoc, getDocs, updateDoc, doc, query, where } from "firebase/firestore"; 
import { db } from "../firebase";

// Atualizar para a estrutura completa
class UserData {
    constructor(displayName = "", email = "", handle = "") {
        this.displayName = displayName;
        this.email = email;
        this.handle = handle;
    }

    toJSON() {
        return {
            displayName: this.displayName,
            email: this.email,
            handle: this.handle
        };
    }
}

function generateDBHandle(user) {
    if (!user) return "default";
    return user.email ? "@" + user.email.split("@")[0] : "default";
}

async function createDefaultDBUser(user) {
    const handle = generateDBHandle(user);
    const dbUser = await fetchDBUser(handle);

    if (!dbUser) {
        const reference = collection(db, "users");
        const newUser = new UserData(
            user?.displayName || "", 
            user?.email || "", 
            handle
        );

        try {
            await addDoc(reference, newUser.toJSON());
            console.log("User added to Firestore:", handle);
        } catch (error) {
            console.error("Error adding user to Firestore:", error);
        }
    }
}

async function updateDBUserData(user, userData) {
    const handle = generateDBHandle(user);
    let dbUser = await fetchDBUser(handle);

    if(!dbUser) {
        await createDefaultDBUser(user);
        dbUser = await fetchDBUser(handle);
    }

    try {
        const userRef = doc(db, "users", dbUser.id);
        await updateDoc(userRef, userData.toJSON());
        console.log("User data updated:", handle);
    } catch (error) {
        console.error("Error updating user data:", error);
    }
}

async function fetchDBUser(handle) {
    const reference = collection(db, "users");
    const q = query(reference, where("handle", "==", handle));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        } else {
            return querySnapshot.docs[0].data();
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

export { UserData, generateDBHandle, createDefaultDBUser, updateDBUserData, fetchDBUser }