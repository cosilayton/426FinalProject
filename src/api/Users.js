import Firebase from './Firebase';

const ApiUsers = {
    create(username, profileURL)  {
        const uid = Firebase.auth().currentUser.uid;
        const user = Firebase.database().ref(`users/${uid}`);
        user.set({ username, profileURL });
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
