import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

const axios = require('axios');

export default class GameListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSearch: ''
    };
    this.clicked = this.clicked.bind(this);
  }

  clicked() {
    console.log('click');
  }

  render() {
    return (
      <div className="game-list-item">
        <div>
          <h3 className="text-center">{this.props.object.name}</h3>
        </div>
        <div>
          <p>{this.props.object.rankname}</p>
          <select
            onChange={e => {
              console.log(e.target.value);
              this.props.sendUp(e.target.value, this.props.object.name);
            }}
          >
            {this.props.object.ranks.map(x => <option value={x}>{x}</option>)}
          </select>
        </div>
      </div>
    );
  }
}
