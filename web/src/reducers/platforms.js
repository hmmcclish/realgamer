
export default (state = [], {type, payload}) => {
    switch (type) {
        case 'RECEIVE_PLATFORMS':
            return [...payload.platforms];
        default:
            return state;
    }
};

export const getPlatforms = (state = {}) => state.platforms;
