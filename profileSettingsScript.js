import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAO7yVsbW4UiirQkETYP_EEojjdhWqWhOQ",
    authDomain: "tournafire-tournament.firebaseapp.com",
    projectId: "tournafire-tournament",
    storageBucket: "tournafire-tournament.appspot.com",
    messagingSenderId: "406026369566",
    appId: "1:406026369566:web:2cb92862b0fa486b628c0f",
    measurementId: "G-PN0B950P6R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form from submitting normally

    const user = auth.currentUser;
    if (user) {
        const freeFireName = document.getElementById("freeFireName").value;
        const yourName = document.getElementById("yourName").value;
        const mobileNumber = document.getElementById("mobileNumber").value;

        await setDoc(doc(db, "users", user.uid), {
            freeFireName: freeFireName,
            yourName: yourName,
            mobileNumber: mobileNumber
        }, { merge: true });

        alert("Profile updated successfully!");
        window.location.href = "profile.html";
    } else {
        window.location.href = "index.html"; // Redirect if not authenticated
    }
});
