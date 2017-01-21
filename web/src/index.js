/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import rootReducer from './reducers/index';
import App from './App';
import './css/box-sizing.css';
import './css/reset.css';
import './css/app.css';

injectTapEventPlugin();

const logger = createLogger();

// logger must be the last one!
const store = createStore(rootReducer, {}, applyMiddleware(thunk, logger));

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <App />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
