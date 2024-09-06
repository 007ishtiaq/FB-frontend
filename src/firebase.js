import * as firebase from "firebase";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQcOG9w-uARiuGNvdpuPtstIn-IN3-GOM",
  authDomain: "mastermerm.firebaseapp.com",
  projectId: "mastermerm",
  storageBucket: "mastermerm.appspot.com",
  messagingSenderId: "271459179906",
  appId: "1:271459179906:web:8b559e4f6970bff083039b",
  measurementId: "G-EDCPWXQB8N",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
