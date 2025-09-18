
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore();

// Garantir persistência da sessão
setPersistence(auth, browserLocalPersistence);

async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const email = user.email;

    // Verificar no Firestore
    try {
      const ref = doc(db, "usersByEmail", email);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().hasAccess === true) {
        window.location.href = "/app/app/index.html";
      } else {
        window.location.href = "https://pintando-a-palavra.pay.yampi.com.br/pay/INZKNQK27G";
      }
    } catch (e) {
      console.error("Erro ao verificar Firestore:", e);
      window.location.href = "https://pintando-a-palavra.pay.yampi.com.br/pay/INZKNQK27G";
    }

  } catch (error) {
    console.error("Erro no login:", error);
    alert("Erro ao logar. Você será redirecionado ao checkout.");
    window.location.href = "https://pintando-a-palavra.pay.yampi.com.br/pay/INZKNQK27G";
  }
}

document.getElementById("login-btn").addEventListener("click", login);
