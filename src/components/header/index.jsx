import React, { useState, useEffect, useRef } from 'react';

import './style.scss';
import { Link } from 'react-router-dom';

import { FaUser } from "react-icons/fa";
import { useAuth } from '../../context/authContext';

function Header() {
    const { logOut } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const userIconRef = useRef(null);

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current && 
            !dropdownRef.current.contains(event.target) && 
            userIconRef.current && 
            !userIconRef.current.contains(event.target)
        ) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return ( 
        <div className="header">
            <div className="container">
                <div className="logo">
                    <Link to={'/'}>
                        <div className="inner">
                            eTanu
                        </div>
                    </Link>
                </div>

                <div className="navigation">
                    <div>
                        <Link to={'/history'}>История запросов</Link>
                    </div>
                    <div><Link to={'/profile'}>Профиль</Link></div>
                    <div onClick={logOut}>Выйти</div>
                    {/* <div ref={userIconRef}>
                        <FaUser size={20} onClick={() => setDropdownOpen(prev => !prev)} />
                    </div> */}
                    {/* <div ref={dropdownRef} className={`profile-dropdown ${!dropdownOpen ? 'close' : ''}`}> */}
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
}

export default Header;
