import { collection, addDoc, getDocs, updateDoc, doc, query, where } from "firebase/firestore"; 
import { db } from "../firebase";

// Atualizar para a estrutura completa
class UserData {
    constructor(
        data = {}
    ) {
        if (typeof data === 'object' && !Array.isArray(data)) {
            this.email = data.email || "";
            this.handle = data.handle || "";
            this.displayName = data.displayName || "";
            this.activities = data.activities || [];
            this.history = data.history || []; // url + has_liked + has_disliked
            this.prof_pic_url = data.prof_pic_url || "";
            this.bio = data.bio || "";
            this.followers = data.followers || [];  // list of handles
            this.following = data.following || [];
            this.learning = data.learning || [];    // list of languages (int)
            this.teaching = data.teaching || [];
            this.badges = data.badges || [];        // list of badges (int)
        } else {
            this.email = arguments[0] || "";
            this.handle = arguments[1] || "";
            this.displayName = arguments[2] || "";
            this.activities = arguments[3] || [];
            this.history = arguments[4] || []; // url + has_liked + has_disliked
            this.prof_pic_url = arguments[5] || "";
            this.bio = arguments[6] || "";
            this.followers = arguments[7] || [];  // list of handles
            this.following = arguments[8] || [];
            this.learning = arguments[9] || [];    // list of languages (int)
            this.teaching = arguments[10] || [];
            this.badges = arguments[11] || [];        // list of badges (int)
        }
    }

    addToHistory(url, has_liked = false, has_disliked = false) {
        this.history.push({
            url: url,
            has_liked: has_liked,
            has_disliked: has_disliked
        });
    }

    toJSON() {
        return {
            displayName: this.displayName,
            email: this.email,
            handle: this.handle,        
            activities: this.activities,
            history: this.history,
            prof_pic_url: this.prof_pic_url,
            bio: this.bio,
            followers: this.followers,
            following: this.following,
            learning: this.learning,
            teaching: this.teaching,
            badges: this.badges 
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
            user?.email || "",
            handle,
            user?.displayName || ""
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

    if (!dbUser) {
        console.error("User does not exist. Cannot update.");
        return;
    }

    try {
        const userRef = doc(db, "users", dbUser.id);
        await updateDoc(userRef, userData.toJSON());
        const updatedUser = await fetchDBUser(handle);
        console.log("User data updated:", updatedUser.data);
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
            const doc = querySnapshot.docs[0];
            return { id: doc.id, data: doc.data() };
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

export { UserData, generateDBHandle, createDefaultDBUser, updateDBUserData, fetchDBUser }