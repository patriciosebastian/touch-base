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
  const [demoEmail, setDemoEmail] = useState('');
  const [demoPassword, setDemoPassword] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const demoLogin = () => {
    setIsDemo(true);
    setDemoEmail('demo@touchbaseapp.co');
    setDemoPassword('demo123');
  };

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const demoLogout = async () => {
    try {
      setIsRestoring(true);
      const response = await fetch(`https://${backendURL}/demo/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.uid
        }),
      });

      const responseData = await response.json();

      if (response.status !== 200) {
        throw new Error(responseData.error);
      }

      setIsRestoring(false);
      return signOut(auth);
    } catch (err) {
      console.error("Failed to log out:", err.message);
      setIsRestoring(false);
    }
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
  };

  // runs on component mount, and every time auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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
      value={{ currentUser, idToken, authLoading, signup, login, logout, signInWithGoogle, demoEmail, demoPassword, demoLogin, isDemo, setIsDemo, demoLogout, isRestoring, backendURL }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
