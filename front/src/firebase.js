import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDYLxDzPHMcszSx7IXAMM53oLZtNT1Q7Uo",
  authDomain: "mernimess.firebaseapp.com",
  projectId: "mernimess",
  storageBucket: "mernimess.appspot.com",
  messagingSenderId: "386936489343",
  appId: "1:386936489343:web:5a83671193acf48756864a",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
