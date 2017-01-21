const INITIAL_STATE = [];

export default (state = INITIAL_STATE, {type, payload}) => {
    switch (type) {
        case 'PLATFORMS_RECEIVE':
            return [...payload.platforms];
        default:
            return state;
    }
};

export const getPlatforms = state => state.platforms;
