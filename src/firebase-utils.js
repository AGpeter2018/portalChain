import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC60UbY2yJ-jBcZMVo8WfM9nlAyH_tUIqA",
  authDomain: "portalchain-ca25d.firebaseapp.com",
  projectId: "portalchain-ca25d",
  storageBucket: "portalchain-ca25d.firebasestorage.app",
  messagingSenderId: "326019141101",
  appId: "1:326019141101:web:726c2f1374b9f4a9882be4",
  measurementId: "G-369N65HH4Z",
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompts: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
