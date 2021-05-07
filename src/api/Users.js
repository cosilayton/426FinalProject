import Firebase from './Firebase';

const axios = require('axios');

const ApiUsers = {

    // Create a user profile record in Firebase, download its Gravatar image
    // and store it in Firebase Storage.
    create(username, gravatarURL)  {
        const uid = Firebase.auth().currentUser.uid;
        const user = Firebase.database().ref(`users/${uid}`);
        user.set({ username, profileURL: '<pending>' });
        axios({ method: 'get', url: gravatarURL, responseType: 'blob' })
            .then(resp => {
                const blob = resp.data;
                const path = `${uid}.jpg`;
                const metadata = { contentType: blob.type };
                Firebase.storage().ref().child(path).put(blob, metadata)
                    .then(() => {
                        user.child('profileURL').set(path);
                    });
            });
    },

    exists(username)  {
        const users = Firebase.database().ref('users');
        return users.get().then(snapshot => {
            const data = snapshot.val();
            for (let k in data) {
                const existing = data[k].username;
                if (existing === username) {
                    return true;
                }
            }
            return false;
        });
    },

    profileURL(uid)  {
        const user = Firebase.database().ref(`users/${uid}`);
        return user.child('profileURL').get().then(data => data.val());
    }
};

export default ApiUsers;
