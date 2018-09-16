import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import GameListItem from './GameListItem';

const axios = require('axios');

export default class GameList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
      <div className="">
        {this.props.games.map(x => (
          <GameListItem
            games={this.props.games}
            sendUp={this.props.sendUp}
            object={x}
          />
        ))}
      </div>
    );
  }
}
