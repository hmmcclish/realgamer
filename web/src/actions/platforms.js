/* global fetch */
import config from '../config';
import {createPlatform} from '../models/platform';

const receivePlatforms = platforms => ({
    type: 'PLATFORMS_RECEIVE',
    payload: {platforms},
});

export const fetchAllPlatforms = () => (dispatch) => {
    fetch(config.apiUrl + '/platforms')
        .then(res => res.json())
        .then(results => results.map(createPlatform))
        .then(platforms => dispatch(receivePlatforms(platforms)));
};
