import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { 
    doCreateUserWithEmailAndPassword,
    doSignInWithEmailAndPassword   
} from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import { generateDBHandle, setDefaultDBUser } from "../../../firebase/database";

import "./index.css";


const Register = () => {
    const { userLoggedIn, currentUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            try {
                await doCreateUserWithEmailAndPassword(email, password);
                setErrorMessage("");
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsRegistering(false);
            }
        }
    };

    useEffect(() => {
        if (currentUser) {
            setDefaultDBUser(currentUser);
        }
    }, [currentUser]);

    if (userLoggedIn) {
        // Redirect to another page if the user is already logged in
        return <Navigate to="/" replace={true}/>;
    }

    return (
        <div className="login-page">
            <div className="login-container">
            <h1>FluenTchê</h1>
            <h2>Aprenda ensinando!</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit" disabled={isRegistering}>
                {isRegistering ? 'Registrando...' : 'Registre-se'}
                </button>
            </form>
            </div>
        </div>
    );

}

export default Register;