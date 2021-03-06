import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import { Form, Radio, Dimmer, Loader, Image, Segment } from 'semantic-ui-react';

import GameSearchBar from './GameSearchBar';
import CreateGameRoom from './CreateGameRoom';
import GameRoomCard from './GameRoomCard';
import Navbar from './Navbar';

import '../CSS/finder-page.css';

const axios = require('axios');

export default class FinderPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      match: this.props.match,
      gameFilter: null,
      gameRoomList: [],
      currentGame: null,
      value: 'popular',
      gameRoomsLoaded: false
    };
    this.onItemSelect = this.onItemSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getGameRooms = this.getGameRooms.bind(this);
  }

  componentDidMount() {
    this.getGameRooms();
  }

  getGameRooms() {
    this.setState({
      gameRoomsLoaded: false
    });
    if (this.state.currentGame == null) {
      axios
        .get('/api/gameRoom/name', {
          params: {
            filter: this.state.value,
            name: null
          }
        })
        .then(
          function(response) {
            console.log(response.data);
            this.setState({
              gameFilter: this.state.value,
              gameRoomList: response.data,
              gameRoomsLoaded: true
            });
          }.bind(this)
        );
    } else {
      axios
        .get('/api/gameRoom/name', {
          params: {
            filter: this.state.value,
            name: this.state.currentGame.name
          }
        })
        .then(
          function(response) {
            console.log(response.data);
            this.setState({
              gameFilter: this.state.value,
              gameRoomList: response.data,
              gameRoomsLoaded: true
            });
          }.bind(this)
        );
    }
  }

  handleChange(e, { value }) {
    this.setState({ value }, function() {
      this.getGameRooms();
    });
  }

  onItemSelect(object) {
    this.setState({ currentGame: object }, function() {
      this.getGameRooms();
    });
  }

  render() {
    console.log(this.state.match);

    var gameRoomDisplay;

    if (this.state.gameRoomsLoaded) {
      gameRoomDisplay = (
        <div className="finder-page">
          <div className="game-room-display">
            {this.state.gameRoomList.map(x => <GameRoomCard object={x} />)}
          </div>
        </div>
      );
    } else {
      gameRoomDisplay = (
        <div id="loading" className="finder-page">
          <div className="game-room-display">
            <div className="loader">
              <Segment>
                <Dimmer active>
                  <Loader size="massive" />
                </Dimmer>
              </Segment>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="finder-container">

        <div className="page-top">

          <div className="top-bg">
          <Navbar match={this.state.match} sendNewData={this.loadNewData} />
            <h1 className="top-title">Find Or Create Game Ads</h1>
            <div className="search-row">
              <div className="searcher">
                <div className="filters">
                  <Form>
                    <Form.Field>
                      <Radio
                        label="Popular"
                        name="radioGroup"
                        value="popular"
                        checked={this.state.value === 'popular'}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Radio
                        label="New"
                        name="radioGroup"
                        value="new"
                        checked={this.state.value === 'new'}
                        onChange={this.handleChange}
                      />
                    </Form.Field>
                  </Form>
                </div>
                <GameSearchBar goMovie={this.onItemSelect} />
                <CreateGameRoom
                  reload={() => {
                    this.getGameRooms();
                    console.log('reload');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {gameRoomDisplay}
      </div>
    );
  }
}
