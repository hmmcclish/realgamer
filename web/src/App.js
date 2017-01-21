import React, {Component, PropTypes as t} from 'react';
import {connect} from 'react-redux';

import {fetchAllPlatforms} from './actions/platforms';
import {getPlatforms} from './reducers';

const {keys} = Object;

class App extends Component {

    constructor() {
        super();
        this.state = {
            category: -1,
            developer: -1,
            platform: -1,
        };
        this.selectCategory = this.selectCategory.bind(this);
        this.selectDeveloper = this.selectDeveloper.bind(this);
    }

    componentWillMount() {
        this.props.fetchAllPlatforms();
    }

    selectCategory(i) {
        this.setState({
            category: this.state.category === i ? -1 : i,
            developer: -1,
            platforms: -1,
        });
    }

    selectDeveloper(j) {
        this.setState({
            developer: this.state.developer === j ? -1 : j,
            platforms: -1,
        });
    }
    //http://mandarinconlabarba.github.io/react-tree-menu/example/index.html
    render() {
        const categories = {
            Consoles: {},
            Handhelds: {},
        };
        this.props.platforms.forEach((p) => {
            const category = categories[p.isHandheld ? 'Handhelds' : 'Consoles'];
            category[p.developer] = category[p.developer] || [];
            category[p.developer].push(p.name);
        });

        return (
            <div>

                <header style={{height: 60, display: 'flex', alignItems: 'center', fontSize: 28, background: '#ccc', padding: '0 15px'}}>
                    RealGamer
                </header>

                <div style={{padding: 16, background: '#fff', width: 300, overflow: 'hidden'}}>
                    <ul style={{marginLeft: 16}}>
                        {keys(categories).map((cat, i) => [
                            <li key={cat} onClick={() => this.selectCategory(i)}>{cat}</li>,
                            (this.state.category === i) && (
                                <ul style={{marginLeft: 16}}>
                                    {keys(categories[cat]).map((dev, j) => [
                                        <li ket={dev} onClick={() => this.selectDeveloper(j)}>{dev}</li>,
                                        (this.state.developer === j) && (
                                            <ul style={{marginLeft: 16}}>
                                                {categories[cat][dev].map(n => <li key={n}>{n}</li>)}
                                            </ul>
                                        ),
                                    ])}
                                </ul>
                            ),
                        ])}
                    </ul>
                </div>

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
