// ... (ऊपर का firebaseConfig वाला हिस्सा वैसे ही रहने दें)

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
    
    // यह रहा नया वेलकम मैसेज वाला कोड
    alert("बधाई हो! आपका रजिस्ट्रेशन सफल रहा। Welcome to Global Bazaar!");
    window.location.reload(); 
    
  } catch (error) {
    alert("Error: " + error.message);
  }
});


