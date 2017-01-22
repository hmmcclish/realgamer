/* global fetch */
import config from '../config';
import {createGame} from '../models/game';

const receiveGames = games => ({
    type: 'GAMES_RECEIVE',
    payload: {games},
});

export const fetchGames = platformId => dispatch =>
    fetch(`${config.apiUrl}/platforms/${platformId}/games`)
        .then(res => res.json())
        .then(results => results.map(createGame))
        .then(games => dispatch(receiveGames(games)));
