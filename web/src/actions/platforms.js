/* global fetch */
import config from '../config';

const receivePlatforms = platforms => ({
    type: 'PLATFORMS_RECEIVE',
    payload: {platforms},
});

export const fetchAllPlatforms = () => (dispatch) => {
    fetch(config.apiUrl + '/platforms')
        .then(res => res.json())
        .then(platforms => dispatch(receivePlatforms(platforms)));
};
