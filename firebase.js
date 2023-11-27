import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbWpdkF72B3ffC5nv8xQB5mgRmTtRj5yM",
  authDomain: "portfolio-fbe38.firebaseapp.com",
  projectId: "portfolio-fbe38",
  storageBucket: "portfolio-fbe38.appspot.com",
  messagingSenderId: "291752368516",
  appId: "1:291752368516:web:16880e36229366b7f865d1",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
