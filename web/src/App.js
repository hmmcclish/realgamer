import React from 'react';

import Header from './components/header';
import Sidebar from './components/sidebar';

const App = ({children}) => (
    <div>
        <Header />
        <Sidebar />
        {children}
    </div>
);

export default App;
