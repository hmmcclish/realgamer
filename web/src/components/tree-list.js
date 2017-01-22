import React, {PropTypes as t} from 'react';

const TreeList = ({children = [], style}) => (
    <ul style={style}>
        {children}
    </ul>
);

TreeList.propTypes = {
    style: t.object,
    children: t.node,
};

TreeList.Item = ({id, title, children = [], isOpen = true, onPress}) => (
    <li key={id || title} style={{margin: '8px 0'}}>
        <div onClick={onPress} style={{cursor: 'pointer'}}>
            {title}
        </div>
        {!!children.length && (
            <ul style={{paddingLeft: 24, height: isOpen ? 'auto' : 0, overflow: 'hidden'}}>
                {children}
            </ul>
        )}
    </li>
);

TreeList.Item.propTypes = {
    id: t.string,
    title: t.node.isRequired,
    children: t.node,
    isOpen: t.bool,
    onPress: t.func,
};

export default TreeList;
