import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBR3LsjdbHfozHrIJfP5nhwQtMFSR-1zaA",
  authDomain: "aurora-health-bad27.firebaseapp.com",
  projectId: "aurora-health-bad27",
  storageBucket: "aurora-health-bad27.firebasestorage.app",
  messagingSenderId: "917355999039",
  appId: "1:917355999039:web:e41685aa1c8d353b6aed8a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const saveHealthData = async (userId, data) => {
  try {
    await setDoc(doc(db, "users", userId, "healthData", "current"), {
      ...data, updatedAt: new Date().toISOString()
    });
  } catch (e) { console.log("Save error:", e); }
};

export const loadHealthData = async (userId) => {
  try {
    const snap = await getDoc(doc(db, "users", userId, "healthData", "current"));
    return snap.exists() ? snap.data() : null;
  } catch (e) { return null; }
};

export const saveUserProfile = async (userId, profile) => {
  try {
    await setDoc(doc(db, "users", userId, "profile", "info"), profile);
  } catch (e) { console.log("Profile save error:", e); }
};

export const saveAIMessage = async (userId, message) => {
  try {
    await addDoc(collection(db, "users", userId, "conversations"), {
      ...message, timestamp: new Date().toISOString()
    });
  } catch (e) { console.log("Message save error:", e); }
};

export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup };