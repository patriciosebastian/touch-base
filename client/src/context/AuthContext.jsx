import { createContext, useContext, useState, useEffect } from "react";
import { auth, provider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [idToken, setIdToken] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  function signInWithGoogle(onSuccess) {
    signInWithPopup(auth, provider)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user); // remove later
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("Error signing in with Google: ", errorCode);
        const errorMessage = error.message;
        console.log("Error signing in with Google: ", errorMessage);
        const email = error.email;
        console.log("Error signing in with Google: ", email);
        // AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("Error signing in with Google: ", credential);
      });
  }

  // runs on component mount, and every time auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // console.log(currentUser);
      setCurrentUser(currentUser);
      if (currentUser) {
        //force refresh token if its expired
        currentUser.getIdToken(true).then((idToken) => {
          setIdToken(idToken);
          setAuthLoading(false);
        });
      } else {
        setAuthLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, idToken, authLoading, signup, login, logout, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
