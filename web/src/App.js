import React, {Component, PropTypes as t} from 'react';
import {connect} from 'react-redux';

import {fetchAllPlatforms} from './actions/platforms';
import {getPlatforms} from './reducers';
import TreeList from './components/tree-list';

const {values} = Object;

class App extends Component {

    constructor() {
        super();
        this.state = {
            console: true,
            handheld: true,
        };
    }

    componentWillMount() {
        this.props.fetchAllPlatforms();
    }

    render() {
        const createItem = (id, name, items) => ({id, name, items});
        const categories = {
            c: createItem('console', 'Consoles', {}),
            h: createItem('handheld', 'Handhelds', {}),
        };

        // build platforms tree
        this.props.platforms.forEach(({id, isHandheld, developer, name}) => {
            const type = isHandheld ? 'h' : 'c';
            const cat = categories[type];
            const develId = `${type}-${developer}`;
            cat.items[developer] = cat.items[developer] || createItem(develId, developer, {});
            cat.items[developer].items[name] = createItem(id, name, {});
        });

        return (
            <div>

                <header style={{height: 60, display: 'flex', alignItems: 'center', fontSize: 28, background: '#ccc', padding: '0 15px'}}>
                    RealGamer
                </header>

                <TreeList style={{float: 'left', width: 350, background: '#fff', padding: 16}}>
                    {values(categories).map(({id, name, items}) => (
                        <TreeList.Item
                            key={id}
                            title={name}
                            isOpen={!!this.state[id]}
                            onPress={() => this.setState({[id]: !this.state[id]})}
                        >
                            {values(items).map(({id, name, items}) => (
                                <TreeList.Item
                                    key={id}
                                    title={name}
                                    isOpen={!!this.state[id]}
                                    onPress={() => this.setState({[id]: !this.state[id]})}
                                >
                                    {values(items).map(({name, id}) => (
                                        <TreeList.Item
                                            key={id}
                                            title={name}
                                        />
                                    ))}
                                </TreeList.Item>
                            ))}
                        </TreeList.Item>
                    ))}
                </TreeList>

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
