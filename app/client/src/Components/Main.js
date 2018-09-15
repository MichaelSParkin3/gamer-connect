import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Image, Icon } from 'semantic-ui-react';
import { addProfile } from '../Actions/actions';

import '../CSS/main.css';

const axios = require('axios');

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    };

    this.responseFacebook = this.responseFacebook.bind(this);
  }

  responseFacebook(response) {
    console.log(response);

    const thisa = this;

    // create a string for an HTTP body message
    const email = encodeURIComponent(response.email);
    const password = encodeURIComponent(response.accessToken);
    const formData = `email=${email}&password=${password}`;

    axios({
      method: 'post',
      url: '/facebook',
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
        }
      })
      .bind(this)
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
      <div className="container main-container">
        <div className="jumbotron text-center">
          <h1>Do We Know You?</h1>

          <p>Login or Register with:</p>

          <Link to="/login" className="btn btn-default">
            <span className="fa fa-user" /> Local Login
          </Link>

          <FacebookLogin
            appId="687411981618374"
            autoLoad={false}
            fields="name,email,picture"
            callback={this.responseFacebook}
          />

          <Link to="/signup" className="btn btn-default">
            <span className="fa fa-user" /> Local Signup
          </Link>
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
)(Main);
