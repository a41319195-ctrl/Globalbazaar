import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvbSJkEH3NDNy_SIaf0bJk0hkhknTRhno",
  authDomain: "globalbazaar-2c6cb.firebaseapp.com",
  projectId: "globalbazaar-2c6cb",
  storageBucket: "globalbazaar-2c6cb.firebasestorage.app",
  messagingSenderId: "734113870757",
  appId: "1:734113870757:web:653ac103c064685cbaee4c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

document.getElementById("vendorForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = "UserPassword123"; 

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: name,
      email: email,
      role: "vendor"
    });
    alert("बधाई हो! आपका रजिस्ट्रेशन सफल रहा।");
  } catch (error) {
    alert("Error: " + error.message);
  }
});

