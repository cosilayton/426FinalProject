import Firebase from './Firebase';

const ApiUsers = {
    create(username, profileURL)  {
        const uid = Firebase.auth().currentUser.uid;
        const user = Firebase.database().ref(`users/${uid}`);
        user.set({ username, profileURL });
    },
    profileURL(uid)  {
        const user = Firebase.database().ref(`users/${uid}`);
        return user.child('profileURL').get().then(data => data.val());
    }
};

export default ApiUsers;
