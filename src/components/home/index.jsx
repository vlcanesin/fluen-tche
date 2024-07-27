import React from "react";
import { useAuth } from "../../contexts/authContext";
import { generateDBHandle, getDBUser } from "../../firebase/database";

async function fetchUser(handle) {
    try {
        const user = await getDBUser(handle);
        console.log(user);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

const Home = () => {
    const { currentUser } = useAuth();
    const userHandle = generateDBHandle(currentUser);
    //console.log(userHandle);
    fetchUser(userHandle);
    fetchUser("123121");
    return(
        <h1>Bem vindo, {currentUser.displayName ? currentUser.displayName : currentUser.email}!</h1>
    );
}

export default Home;