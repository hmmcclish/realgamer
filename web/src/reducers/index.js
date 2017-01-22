import {combineReducers} from 'redux';

import platforms, * as fromPlatforms from './platforms';
import games, * as fromGames from './games';

export default combineReducers({
    platforms,
    games,
});

export const getPlatforms = state => fromPlatforms.getPlatforms(state);
export const getPlatform = (state, id) => fromPlatforms.getPlatform(state, id);

export const getGames = (state, platformId) => fromGames.getGames(state, platformId);
