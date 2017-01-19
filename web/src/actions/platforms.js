/* global fetch */
import config from '../config';
import {createPlatform} from '../models/platform';

const receivePlatforms = platforms => ({
    type: 'RECEIVE_PLATFORMS',
    payload: {platforms},
});

export const fetchAllPlatforms = () => (dispatch) => {
    console.log('>>> fetch');
    fetch(config.apiUrl + '/platforms')
        .then(res => res.json())
        .then(results => results.map(createPlatform))
        .then(platforms => dispatch(receivePlatforms(platforms)));
};
