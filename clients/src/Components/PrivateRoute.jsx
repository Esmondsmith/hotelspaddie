// Components/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const authenticated = isAuthenticated();

  console.log('PrivateRoute check:', {
    authenticated,
    currentPath: location.pathname,
    redirecting: !authenticated
  });

  if (!authenticated) {
    // Redirect to login page with return url
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname,
          message: 'Please log in to access this page'
        }}
        replace 
      />
    );
  }

  return children;
};

export default PrivateRoute;