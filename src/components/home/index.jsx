import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { generateDBHandle, fetchDBUser } from "../../firebase/firestore/user";

const Home = () => {
    const { currentUser } = useAuth();
    const [userInDB, setUserInDB] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (currentUser) {
                const userHandle = generateDBHandle(currentUser);
                const fetchedUser = await fetchDBUser(userHandle);
                setUserInDB(fetchedUser);
            }
        };

        fetchUser();
    }, [currentUser]);

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
        </div>
    );
};

export default Home;