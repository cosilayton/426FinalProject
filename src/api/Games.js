import Firebase from './Firebase';

const ApiGames = {

    all() {
    },

    create()  {
        // get the currently signed in user
        const user = Firebase.auth().currentUser;
        // find game location set up in firebase database
        const games = Firebase.database().ref('games');
        // pushing generates unique key for the game
        // adds it to games location in database
        const newGame = games.push();
        newGame.set({
            uid: user.uid,
            started_at: +new Date(),
            score: 0
        });
        return newGame.key;
    },

    updateScore(gameId, score) {
        const game = Firebase.database().ref(`games/${gameId}`);
        game.child('score').set(score);
    },

    finish(gameId) {
        const game = Firebase.database().ref(`games/${gameId}`);
        game.child('finished_at').set(+new Date());
    }
};

export default ApiGames;
