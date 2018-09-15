import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import { Form, Radio } from 'semantic-ui-react';

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
      value: 'popular'
    };
    this.onItemSelect = this.onItemSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getGameRooms = this.getGameRooms.bind(this);
  }

  getGameRooms() {
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
              gameRoomList: response.data
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
              gameRoomList: response.data
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
    return (
      <div className="finder-container">
        <Navbar match={this.state.match} sendNewData={this.loadNewData} />
        <div className="finder-page">
          <CreateGameRoom />
          <GameSearchBar goMovie={this.onItemSelect} />
          <div className="filters">
            <Form>
              <Form.Field>
                Selected value: <b>{this.state.value}</b>
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Sort by popular"
                  name="radioGroup"
                  value="popular"
                  checked={this.state.value === 'popular'}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label="Sort by new"
                  name="radioGroup"
                  value="new"
                  checked={this.state.value === 'new'}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </div>
          <div className="game-room-display">
            {this.state.gameRoomList.map(x => <GameRoomCard object={x} />)}
          </div>
        </div>
      </div>
    );
  }
}