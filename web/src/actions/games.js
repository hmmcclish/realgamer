/* global fetch */
import config from '../config';

const receiveGames = (platformId, games) => ({
    type: 'GAMES_RECEIVE',
    payload: {platformId, games},
});

export const fetchGames = platformId => dispatch =>
    fetch(`${config.apiUrl}/platforms/${platformId}/games`)
        .then(res => res.json())
        .then(games => dispatch(receiveGames(platformId, games)));
