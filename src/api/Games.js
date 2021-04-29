import Firebase from './Firebase';

const ApiGames = {

    all() {
    },

    create()  {
        const user = Firebase.auth().currentUser;
        const games = Firebase.database().ref('games');
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
