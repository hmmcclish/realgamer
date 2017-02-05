import makeId from '../utils/make-id';

const INITIAL_STATE = {
    // [platformId]: {gameId: gameModel, ...}
};

export default (state = INITIAL_STATE, {type, payload}) => {
    const next = {...state};
    switch (type) {
        case 'GAMES_RECEIVE':
            const {platformId, games} = payload;
            games.forEach((game) => {
                const {title: [{name: title}]} = game;
                const id = makeId(title);
                next[platformId] = next[platformId] || {};
                next[platformId][id] = {id, ...game};
            });
            return next;
        default:
            return state;
    }
};

export const getGames = (state, platformId) => Object.values(state[platformId] || {});
