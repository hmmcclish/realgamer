import makeId from '../utils/make-id';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, {type, payload}) => {
    switch (type) {
        case 'PLATFORMS_RECEIVE':
            const next = {...state};
            payload.platforms.forEach(p => {
                const id = makeId(p.title[0].name);
                next[id] = {id, ...p};
            });
            return next;
        default:
            return state;
    }
};

export const getPlatforms = state => Object.values(state);
export const getPlatform = (state, id) => state[id] || {};
