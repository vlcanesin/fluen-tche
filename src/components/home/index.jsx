import React from "react";
import { useAuth } from "../../contexts/authContext";

const Home = () => {
    const { currentUser } = useAuth();
    return(<h1>Bem vindo, {currentUser.displayName ? currentUser.displayName : currentUser.email}!</h1>);
}

export default Home;