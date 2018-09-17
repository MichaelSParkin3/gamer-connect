import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

const axios = require('axios');

export default class SearchSuggestionItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSearch: ''
    };
    this.clicked = this.clicked.bind(this);
  }

  clicked() {
    console.log('click');
    this.props.func(this.props.object);
  }

  render() {
    return (
      <div className="search-suggestion grow" onClick={this.clicked}>
        <div>
          <h3 className="text-center">{this.props.name}</h3>
        </div>
      </div>
    );
  }
}
