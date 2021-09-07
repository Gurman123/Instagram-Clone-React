import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCPedNyAFpLaRvFyV48K2mKAN4P2oFnMhs",
    authDomain: "instagram-clone-react-546c6.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-546c6-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-react-546c6",
    storageBucket: "instagram-clone-react-546c6.appspot.com",
    messagingSenderId: "621832198947",
    appId: "1:621832198947:web:8ae633e52051174106ca96",
    measurementId: "G-G5GMHQCZLX"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };