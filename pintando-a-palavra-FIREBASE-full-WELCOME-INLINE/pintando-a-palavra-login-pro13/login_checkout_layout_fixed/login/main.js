
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, 
  setPersistence, browserLocalPersistence, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD4nZO1U5RrZt38s1sKKneRF30e8iTXIL4",
  authDomain: "pintando-a-palavra-5f46c.firebaseapp.com",
  projectId: "pintando-a-palavra-5f46c",
  storageBucket: "pintando-a-palavra-5f46c.appspot.com",
  messagingSenderId: "278609879698",
  appId: "1:278609879698:web:bec9357724db90535dfc4b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const CHECKOUT_URL = "https://pintando-a-palavra.pay.yampi.com.br/pay/INZKNQK27G";
const MASTER_EMAIL = "ezequielf566@gmail.com";

// Set persistence
setPersistence(auth, browserLocalPersistence);

function redirectUser(email) {
  if (email === MASTER_EMAIL) {
    window.location.href = "/app/app/index.html";
    return;
  }
  const ref = doc(db, "usersByEmail", email);
  getDoc(ref).then(snap => {
    if (snap.exists() && snap.data().hasAccess === true) {
      window.location.href = "/app/app/index.html";
    } else {
      window.location.href = CHECKOUT_URL;
    }
  }).catch(err => {
    console.error("Erro ao verificar Firestore:", err);
    alert("Erro ao verificar acesso.");
  });
}

// Already logged user
onAuthStateChanged(auth, user => {
  if (user) {
    redirectUser(user.email.toLowerCase());
  }
});

// Login button
function attach() {
  const btn = document.getElementById("loginGoogle");
  if (!btn) { console.warn("Botão loginGoogle não encontrado"); return; }
  btn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      redirectUser(result.user.email.toLowerCase());
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Erro no login: " + err.message);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attach);
} else {
  attach();
}
