import React from 'react';
import Header from '../header';
import Footer from '../footer';

import './style.scss';

function Layout({ children }) {
    return ( 
        <div className='layout'>
            <Header />
            <div className="container">
                { children }
            </div>
        </div>
    );
}

export default Layout;