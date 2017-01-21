import {combineReducers} from 'redux';

import platforms, * as fromPlatforms from './platforms';

export default combineReducers({
    platforms,
});

export const getPlatforms = state => fromPlatforms.getPlatforms(state);
