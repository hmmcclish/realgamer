import React, {Component, PropTypes as t} from 'react';
import {connect} from 'react-redux';

import logo from './logo.svg';
import './App.css';
import {fetchAllPlatforms} from './actions/platforms';
import {getPlatforms} from './reducers';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {a: 5};
    }

    componentWillMount() {
        console.log('adad');
        console.log(this.props);
        console.log(getPlatforms());
        this.props.fetchAllPlatforms();
        this.setState({a: 1232});
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <ul>
                    {this.props.platforms.map(platform =>
                        <li key={platform.id}>{platform.manufacturer} {platform.name}</li>)}
                </ul>
            </div>
        );
    }
}

App.propTypes = {
    platforms: t.array,
    fetchAllPlatforms: t.func,
};

export default connect(
    state => ({
        platforms: getPlatforms(state),
    }),
    {fetchAllPlatforms},
)(App);
