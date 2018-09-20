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

import { Menu, Segment } from 'semantic-ui-react';

import '../CSS/navbar.css';

const axios = require('axios');

var linker = '/profile/notloggedin';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: 'profile',
      link: null,
      redirect: false
    };

    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    if (this.props.profiles.profile != null) {
      console.log('profiles exists');

      linker = '/profile/' + this.props.profiles.profile.profile.gamertag;
    } else {
      console.log('prfile no exist');
      axios.get('/api/getCurrentUser/gamertag', {}).then(
        function(response) {
          console.log(response.data);
          linker = '/profile/' + response.data;
          console.log(linker);
        }.bind(this)
      );
    }
  }

  logout() {
    axios.get('/logout', { withCredentials: true }).then(
      function(response) {
        console.log(response.data);
        this.setState({ redirect: true });
        console.log('logout');
      }.bind(this)
    );
  }

  handleItemClick = (e, { name }) => {
    console.log(name);
    console.log('-----------');
    console.log(this.props.match);
    console.log('-----------');
    if (this.props.match.path == '/profile/:id') {
      if (this.props.profiles.profile != null) {
        console.log(this.props.profiles.profile);
        this.props.sendNewData(this.props.profiles.profile);
      } else {
        console.log('no go');
        this.setState({ redirect: true });
      }
    } else {
    }
    this.setState({ activeItem: name });
    console.log(this.state);
  };

  render() {
    console.log(this.props);
    const { activeItem } = this.state;

    if (this.state.redirect) {
      return <Redirect to={'/'} />;
    }

    return (
      <Segment inverted>
        <Menu inverted pointing secondary>
          <img className="logo" src={require('../imgs/logo.png')} />
          <Menu.Item
            name="Finder"
            as={Link}
            to="/finder"
            active={activeItem === 'Finder'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="Profile"
            as={Link}
            to={linker}
            active={activeItem === 'Profile'}
            onClick={this.handleItemClick}
          />

          <Menu.Item
            name="Logout"
            active={activeItem === 'Logout'}
            onClick={this.logout}
          />
        </Menu>
      </Segment>
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
)(Navbar);
