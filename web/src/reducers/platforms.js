const INITIAL_STATE = {};

export default (state = INITIAL_STATE, {type, payload}) => {
    switch (type) {
        case 'PLATFORMS_RECEIVE':
            const next = {...state};
            payload.platforms.forEach(p => {
                next[p.id] = p;
            });
            return next;
        default:
            return state;
    }
};

export const getPlatforms = state => Object.values(state.platforms);
export const getPlatform = (state, id) => state.platforms[id] || {};
