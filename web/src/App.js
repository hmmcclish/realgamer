import React, {Component} from 'react';
import {connect} from 'react-redux';

import logo from './logo.svg';
import './App.css';
import {fetchAllPlatforms} from './actions/platforms';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {a: 5};
    }

    componentWillMount() {
        fetchAllPlatforms();
        this.setState({a: 1232});
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    {this.state.a}
                </p>
            </div>
        );
    }
}

export default connect()(App);
