import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { addProfile } from '../Actions/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import '../CSS/login.css';

const axios = require('axios');

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {},
      wrongPassword: false,
      wrongEmail: false,
      redirect: false
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(e) {
    var thisa = this;
    thisa.setState({ wrongPassword: false, wrongEmail: false });
    console.log('REQUEST');
    console.log(this.state);
    e.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.email);
    const password = encodeURIComponent(this.state.password);
    const formData = `email=${email}&password=${password}`;

    axios({
      method: 'post',
      url: '/login',
      withCredentials: true,
      data: formData,
      config: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    })
      .then(function(response) {
        //handle success
        console.log(response.data);
        if (response.data == '/') {
          window.location = '/create/profile';
        } else if (response.data.path == 'to profile page') {
          console.log(response.data.userObject);

          thisa.props.addProfile(response.data.userObject).then(() => {
            thisa.setState({ redirect: true });
            // window.location =
            //   '/profile/' + thisa.props.profiles.profile.profile.gamertag;
            // console.log(thisa.props.profiles.profile.profile.gamertag);
          });
        } else if (response.data == 'wrong password') {
          thisa.setState({ wrongPassword: true });
        } else if (response.data == 'no user found') {
          thisa.setState({ wrongEmail: true });
        }
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={'/profile/' + this.props.profiles.profile.profile.gamertag}
        />
      );
    }

    return (
      <div className="login-module">
        <div className="input-container">
          <h1>
            <span className="fa fa-sign-in" />
          </h1>

          {/* show any messages that come back with authentication
    <% if (message.length > 0) { %>
        <div className="alert alert-danger"><%= message %></div>
    <% } %>

*/}

          {/* LOGIN FORM */}
          <form onSubmit={this.onFormSubmit} action="/login" method="post">
            <div className="form-group">
              <label>Email</label>
              <input
                required
                type="text"
                className={
                  this.state.wrongEmail
                    ? 'form-control input-error'
                    : 'form-control'
                }
                name="email"
                value={this.state.email}
                onChange={e => {
                  this.setState({ email: e.target.value });
                }}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                required
                type="password"
                className={
                  this.state.wrongPassword
                    ? 'form-control input-error'
                    : 'form-control'
                }
                name="password"
                value={this.state.password}
                onChange={e => {
                  this.setState({ password: e.target.value });
                }}
              />
            </div>

            <button type="submit" className="btn btn-warning btn-lg">
              Login
            </button>
          </form>

          <p>
            Need an account? <Link to="/signup">Signup</Link>
          </p>
          <p>
            Or go <Link to="/">home</Link>.
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profiles: state.profiles
  };
};

const mapDispatchToProps = dispatch => {
  console.log(dispatch);
  return bindActionCreators({ addProfile: addProfile }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(Login);
