import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

//import PrivateRoute from './Components/PrivateRoute';

// create browser history for navigating
import { createBrowserHistory } from 'history';

import logo from './logo.svg';
import Main from './Components/Main';
import LoginPage from './Components/LoginPage';
import SignupPage from './Components/SignupPage';
import ProfilePage from './Components/ProfilePage';
import FinderPage from './Components/FinderPage';
import Profile from './Components/Profile';
import Landing from './Components/Landing';
import ProfileCreate from './Components/ProfileCreate';

import './App.css';

let history = createBrowserHistory();

const axios = require('axios');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    //this.logout = this.logout.bind(this);
  }

  render() {
    return (
      <div className="App">
        <Route
          exact
          path={process.env.PUBLIC_URL + '/'}
          render={() => <Landing />}
        />

        <Route
          exact
          path={process.env.PUBLIC_URL + '/login'}
          render={() => <LoginPage />}
        />
        <Route
          exact
          path={process.env.PUBLIC_URL + '/signup'}
          render={() => <SignupPage />}
        />
        <Route
          exact
          path={process.env.PUBLIC_URL + '/profile/:id'}
          render={props => <ProfilePage {...props} />}
        />
        <Route
          exact
          path={process.env.PUBLIC_URL + '/finder'}
          render={props => <FinderPage {...props} />}
        />
        <Route
          exact
          path={process.env.PUBLIC_URL + '/create/profile'}
          render={() => <ProfileCreate />}
        />
      </div>
    );
  }
}

export default App;
