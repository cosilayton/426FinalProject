import Firebase from './Firebase';

const ApiUsers = {
    create(username, profileURL)  {
        const uid = Firebase.auth().currentUser.uid;
        const user = Firebase.database().ref(`users/${uid}`);
        user.set({ username, profileURL });
    },
    exists(username)  {
        // TODO: fix me
        const users = Firebase.database().ref('users');
        users.get().then(data => {
            const uids = Object.keys(data.val());
            for (var uid in uids) {
                console.log((data.val())[uid]);
            }
        });
        return users.child('username').equalTo(username).get().then(data => {
            console.log('data:', data);
            return data.exists();
        });
    },
    profileURL(uid)  {
        const user = Firebase.database().ref(`users/${uid}`);
        return user.child('profileURL').get().then(data => data.val());
    }
};

export default ApiUsers;
