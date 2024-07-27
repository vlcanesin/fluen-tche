import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

function generateDBHandle(user) {
    if(!user) return "default";
    return user.email ? "@" + user.email.split("@")[0] : "default";
}

function setDefaultDBUser(user) {
    const handle = generateDBHandle(user);
    if(fetchDBUser(handle) == null) {
        const reference = collection(db, "users");
        let displayName = "", email = "";
        if(user) {
            displayName = user.displayName ? user.displayName : "";
            email = user.email ? user.email : "";
        }
        addDoc(reference, {
            displayName: displayName,
            email: email,
            handle: handle
        });
   }
}

async function getDBUser(handle) {
    const reference = collection(db, "users");
    return getDocs(reference).then((snapshot) => {
        let user = null;
        snapshot.docs.forEach((doc) => {
            if(doc.data().handle === handle) {
                user = doc.data();
            }
        })
        return user;
    });
}

async function fetchDBUser(handle) {
    try {
        const user = await getDBUser(handle);
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

export { generateDBHandle, setDefaultDBUser, getDBUser, fetchDBUser };