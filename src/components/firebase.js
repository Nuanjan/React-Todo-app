import firebase from 'firebase';
import "@firebase/firestore";


const settings = {timestampsInSnapshorts: true}

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "todolist-7eb28.firebaseapp.com",
    projectId: "todolist-7eb28",
    storageBucket: "todolist-7eb28.appspot.com",
    messagingSenderId: "1051472402074",
    appId: "1:1051472402074:web:49652c6e6fb2180efab123"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  

  export default firebase;