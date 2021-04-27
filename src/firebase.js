import Firebase from 'firebase/app';
import "firebase/auth";

const CONFIG = {
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: "cool-react-game",
  authDomain: "cool-react-game.firebaseapp.com",
};

const app = CONFIG.apiKey ? Firebase.initializeApp(CONFIG) : null;

export default app;
