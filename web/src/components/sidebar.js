import React, {PropTypes as t} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import TreeList from './tree-list';
import {fetchAllPlatforms} from '../actions/platforms';
import {getPlatforms} from '../reducers';

const {values} = Object;

class Sidebar extends React.Component {

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
                                        title={<Link to={`/platform/${id}/games`}>{name}</Link>}
                                        onPress={() => {
                                            //this.context.route.push(`/platform/${id}/games`);
                                            console.log(this.context);
                                        }}
                                    />
                                ))}
                            </TreeList.Item>
                        ))}
                    </TreeList.Item>
                ))}
            </TreeList>
        );
    }
}

Sidebar.propTypes = {
    platforms: t.array,
    fetchAllPlatforms: t.func,
};

export default connect(
    state => ({
        platforms: getPlatforms(state),
    }),
    {fetchAllPlatforms},
)(Sidebar);
