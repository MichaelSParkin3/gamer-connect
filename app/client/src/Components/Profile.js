import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

const axios = require('axios');

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      localObject: {}
    };

    this.loadData = this.loadData.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    var thisa = this;
    console.log('LOAD DATA');
    axios
      .get('/profile', { withCredentials: true })
      .then(function(response) {
        // handle success
        console.log(response);
        console.log(response.data.user._id);
        if (response.data.user.local != null) {
          thisa.setState({
            localObject: {
              id: response.data.user._id,
              email: response.data.user.local.email,
              password: response.data.user.local.password
            }
          });
        } else {
          thisa.setState({
            localObject: {
              id: response.data.user._id,
              email: response.data.user.facebook.email,
              password: response.data.user.facebook.token
            }
          });
        }
        console.log(thisa.state);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
      });
  }

  logoutClick() {
    axios
      .get('/logout')
      .then(function(response) {
        // handle success
        console.log(response);
        window.location = '/';
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
      });
  }

  render() {
    return (
      <div className="container">
        <div className="page-header text-center">
          <h1>
            <span className="fa fa-anchor" /> Profile Page
          </h1>
          <button onClick={this.logoutClick} className="btn btn-default btn-sm">
            Logout
          </button>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="well">
              <h3>
                <span className="fa fa-user" /> Local
              </h3>

              <p>
                <strong>id</strong>: {this.state.localObject.id}
                <br />
                <strong>email</strong>: {this.state.localObject.email}
                <br />
                <strong>password</strong>: {this.state.localObject.password}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
