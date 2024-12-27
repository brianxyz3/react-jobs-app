import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase.config";

export const signUpWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logInWithGoogle = async () => {
  const provider = GoogleAuthProvider;
  const result = await signInWithPopup(auth, provider);
  return result;
};

export const logInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doLogOut = () => {
  return auth.signOut();
};

export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const changePassword = async (password) => {
  return updatePassword(auth.currentUser, password);
};

export const emailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
