import React, { useState, useEffect } from 'react';

import { Navigate } from "react-router-dom";
import { useAuth } from '../../context/authContext';

const PrivateRoute = ({ Component }) => {
 
    const { token, devMode } = useAuth();

    useEffect(() => {
    }, [])

    return token || devMode ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;