import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { 
    doSignInWithEmailAndPassword,
    doSignInWithGoogle    
} from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import { createDefaultDBUser } from "../../../firebase/firestore/user";

import "./index.css";

const Login = () => {
    const { userLoggedIn, currentUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithEmailAndPassword(email, password);
                setErrorMessage("");
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithGoogle();
                setErrorMessage("");
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    useEffect(() => {
        if (currentUser) {
            console.log("called setDefaultDBUser");
            createDefaultDBUser(currentUser);
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
                <button type="submit" disabled={isSigningIn}>
                {isSigningIn ? 'Fazendo Login...' : 'Login'}
                </button>
            </form>
            <button className="google-signin" onClick={onGoogleSignIn} disabled={isSigningIn}>
                {isSigningIn ? 'Fazendo Login...' : 'Login com Google'}
            </button>
            <p className="register-link">
                Não tem uma conta? <Link to="/register">Registre-se</Link>
            </p>
            </div>
        </div>
    );

}

export default Login;