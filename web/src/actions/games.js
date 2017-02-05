/* global fetch */
import config from '../config';
import {createGame} from '../models/game';

const receiveGames = (platformId, games) => ({
    type: 'GAMES_RECEIVE',
    payload: {platformId, games},
});

export const fetchGames = platformId => dispatch =>
    fetch(`${config.apiUrl}/platforms/${platformId}/games`)
        .then(res => res.json())
        .then(results => results.map(createGame))
        .then(games => dispatch(receiveGames(platformId, games)));
