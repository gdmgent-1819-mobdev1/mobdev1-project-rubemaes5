const firebaseInstance = require('firebase');

// Initialize Firebase
// TODO: Replace with your project's config
const config = {
    apiKey: "AIzaSyAcptf8JKN83CgE9rHEx1n54__VlpkcY0A",
    authDomain: "kottet-36e19.firebaseapp.com",
    databaseURL: "https://kottet-36e19.firebaseio.com",
    projectId: "kottet-36e19",
    storageBucket: "kottet-36e19.appspot.com",
    messagingSenderId: "1009053817490"
  };

let instance = null;

const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
};

const getInstance = () => {
  if (!instance) {
    initFirebase();
  }
  return instance;
};
export {
  initFirebase,
  getInstance,
};
