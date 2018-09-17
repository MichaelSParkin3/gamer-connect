import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addProfile } from '../Actions/actions';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

import Navbar from './Navbar';

import '../CSS/profile-page.css';

import avatar from '../imgs/avatar-1536100988803.png';

const axios = require('axios');

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      match: this.props.match,
      profile: null,
      profileLoaded: false,
      redirect: false
    };

    this.loadNewData = this.loadNewData.bind(this);
  }

  componentWillMount() {
    console.log('-------------');
    console.log(this.state.match.params.id);
    axios
      .get('/api/profile/gamertag', {
        params: {
          gamertag: this.state.match.params.id
        }
      })
      .then(
        function(response) {
          console.log(response.data);
          this.setState({
            profile: response.data.profile,
            profileLoaded: true
          });
        }.bind(this)
      );
  }

  loadNewData(data) {
    console.log('LOAD NEW DATA');
    console.log(data);
    this.setState({ profile: data.profile });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={'/profile/' + 'Alistar'} />;
    }

    if (this.state.profileLoaded) {
      return (
        <div
          className="profile-container"
          onClick={() => {
            console.log('-------------');
            console.log(this.state);
          }}
        >
          <Navbar match={this.state.match} sendNewData={this.loadNewData} />
          <div className="content-container">
            <div className="info">
              <img
                className="avatar"
                src={require('../imgs/uploads' + this.state.profile.avatar)}
              />
              <h3 className="text-center gamertag">
                {this.state.profile.gamertag}
              </h3>
              <p>{this.state.profile.bio}</p>
              <p>{'Likes: ' + this.state.profile.likes}</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="loading-page">
          <div className="nav">
            <Navbar />
          </div>
          <div className="loader">
            <Segment>
              <Dimmer active>
                <Loader size="massive">Loading</Loader>
              </Dimmer>
            </Segment>
          </div>
        </div>
      );
    }
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
)(ProfilePage);
