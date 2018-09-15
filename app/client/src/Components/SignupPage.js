import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import '../CSS/login.css';
import Signup from './Signup.js';

const axios = require('axios');

export default class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="login-container">
        <div className="photo-module">
          <div className="photo-bg" />
        </div>
        <Signup />
      </div>
    );
  }
}
