/* global fetch */
import config from '../config';
import {greateGame} from '../models/game';

const receiveGames = games => ({
    type: 'GAMES_RECEIVE',
    payload: {games},
});

export const fetchAllPlatforms = id => dispatch =>
    fetch(config.apiUrl + '/games/' + id)
        .then(res => res.json())
        .then(results => results.map(greateGame))
        .then(platforms => dispatch(receiveGames(platforms)));
