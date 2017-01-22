const INITIAL_STATE = {
    // [platformId]: Game[]
};

export default (state = INITIAL_STATE, {type, payload}) => {
    const next = {...state};
    switch (type) {
        case 'GAMES_RECEIVE':
            payload.games.forEach((game) => {
                next[game.platformId] = next[game.platformId] || {};
                next[game.platformId][game.id] = game;
            });
            return next;
        default:
            return state;
    }
};

export const getGames = (state, platformId) => Object.values(state.games[platformId] || {});
