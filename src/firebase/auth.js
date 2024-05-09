// File description:
// This file contains wrappers for the firebase authentication functions

import { auth } from "./firebase";

import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    updatePassword
} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);  
    //result.user accesses the user(name?)
    return result;
};

export const doSignOut = () => {
    return auth.signOut();
};

// Extra features that can also be implemented

// export const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email);  
// };

// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password);
// };

// export const doSendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: `${window.location.origin}/home`,
//     });
// };