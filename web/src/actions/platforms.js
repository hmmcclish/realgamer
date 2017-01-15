/* global fetch */
import config from '../config';
import {createPlatform} from '../models/platform';
import store from '../store';

const receivePlatforms = platforms => ({
    type: 'RECEIVE_PLATFORMS',
    platforms,
});

export const fetchAllPlatforms = () => {
    fetch(config.apiUrl + '/platforms')
        .then(res => res.json())
        .then(results => results.map(createPlatform))
        .then(platforms => store.dispatch(receivePlatforms(platforms)));
};
