import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEcRgeFFQLrhTCUh7CRyFYY6jRXtnpLhc",
  authDomain: "investment-journal-29d10.firebaseapp.com",
  projectId: "investment-journal-29d10",
  storageBucket: "investment-journal-29d10.appspot.com",
  appId: "1:123456789:web:abc123def456", 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication Functions
export const registerUser = (email, password) => 
  createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (email, password) => 
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const onAuthStateChangedListener = (callback) => 
  onAuthStateChanged(auth, callback);

// Firestore Functions
export const addDecision = async (userId, decision) => {
  try {
    const docRef = await addDoc(collection(db, "decisions"), { 
      ...decision, 
      userId, 
      timestamp: Date.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding decision: ", error);
    throw error;
  }
};

export const getUserDecisions = async (userId) => {
  try {
    const q = query(collection(db, "decisions"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching decisions: ", error);
    throw error;
  }
};


export const fetchAIInsights = async (userId, prompt) => {
  console(userId,prompt);
  try {
    const pastDecisions = await getUserDecisions(userId);
    
    const pastDecisionsFormatted = pastDecisions.map(decision => 
      `${decision.decisionName}: ${decision.decisionOutcome}`).join("\n");

    const fullPrompt = `
      Based on the following past decisions:\n${pastDecisionsFormatted}\n
      and this current prompt: "${prompt}", provide AI-driven insights.`;

    const response = await fetch('https://gemini-api-url.com/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ``,
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI insights');
    }

    const data = await response.json();
    return data.insights;
  } catch (error) {
    console.error("Error fetching AI insights: ", error);
    throw error;
  }
};

export default app;
