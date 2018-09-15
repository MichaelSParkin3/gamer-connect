import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

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

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route
          exact
          path={process.env.PUBLIC_URL + '/'}
          render={() => <Main />}
        />
        <Route
          exact
          path={process.env.PUBLIC_URL + '/landing'}
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
