// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
const axios = require('axios');

const PrivateRoute = ({ component: Component, ...rest }) => {
  // Add your own authentication on the below line.
  const isLoggedIn = () => {
    axios.get('/api/CheckLoggedIn', {}).then(
      function(response) {
        console.log(response.data);
        console.log('logged?');
        if (response.data == 'logged') {
          return true;
        } else {
          return false;
        }
      }.bind(this)
    );
  };

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
