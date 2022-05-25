import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword
} from 'firebase/auth' 

import { 
    getFirestore,
    doc, 
    getDoc, 
    setDoc,
    updateDoc
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDsp50dTgByGhToGci7qqZUayYxPGvjP1E",
    authDomain: "chess-wda.firebaseapp.com",
    projectId: "chess-wda",
    storageBucket: "chess-wda.appspot.com",
    messagingSenderId: "153859942990",
    appId: "1:153859942990:web:20f5af1468275f4f3b711f",
};

const app = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account"
});

export const auth = getAuth()
export const db = getFirestore()

export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider)

export const signOutUser = async () => await signOut(auth)

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback)

export const signInAuthUserWithEmailAndPassword = async(email, password) => {
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password)
}

export const createAuthUserWithEmailAndPassword = async(email, password) => {
    if (!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password)
}

export const getUserFromDatabase = async(id) => {
    const userDocRef = doc(db, 'users', id)
    try {
        const userSnapshot = await getDoc(userDocRef)
        const userData = userSnapshot.data()
        return {
            displayName: userData.displayName,
            uid: id
        }
    } catch (err) {
        console.log('error getting user', err.message)
    }
}

export const changeUsername = async(id, username) => {
    if (!username) return;

    const userDocRef = doc(db, 'users', id)
    try {
        await updateDoc(userDocRef, {"displayName": username})
        return {
            displayName: username,
            uid: id
        }
    }  catch (err) {
        console.log('error changing username', err.message)
    }
}

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
    if (!userAuth) return;

    const userDocRef = doc(db, 'users', userAuth.uid)
    const userSnapshot = await getDoc(userDocRef)

    if(!userSnapshot.exists() && (userAuth.displayName || additionalInformation.displayName)) {
        const { displayName, email } = userAuth;
        const createdAt = new Date()
        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation
            });
            return await getUserFromDatabase(userAuth.uid);
        } catch (err) {
            console.log('error creating the user', err.message)
        }
    } else if (userSnapshot.exists()) {
        return await getUserFromDatabase(userAuth.uid);
    } else {
        return null;
    }
}