import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import SearchSuggestionItem from './SearchSuggestionItem';

const axios = require('axios');

var suggestionsLoaded = false;
var isTimerRunning = false;
var typeTimer;
var searchTerm;
var movieFunc;
var movieArray;

export default class GameSearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      text: []
    };
    this.suggestionClicked = this.suggestionClicked.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.startSearch = this.startSearch.bind(this);
    this.getSearchSuggestions = this.getSearchSuggestions.bind(this);
  }

  /*
  When text in searchbar is changed it generates line of 5 suggetion items
  */
  onInputChange(event) {
    this.setState({ term: event.target.value });
    this.setState({ text: [] });
    console.log(this.state.text);
    searchTerm = event.target.value;
    if (isTimerRunning == false) {
      isTimerRunning = true;
      typeTimer = setTimeout(() => {
        this.startSearch(searchTerm);
        isTimerRunning = false;
      }, 300);
    } else {
      console.log('Timer is Runnoing');
      clearTimeout(typeTimer);
      typeTimer = setTimeout(() => {
        this.startSearch(searchTerm);
        isTimerRunning = false;
      }, 300);
    }
  }

  /*
  checks to see if current search term is blank and if it isn't it will continue generating items
  */

  startSearch(term) {
    if (term == '') {
      console.log('NO TERM');
      this.setState({ text: [] });
    } else {
      console.log(term + '3');
      this.getSearchSuggestions(term);
    }
  }

  /*
  Gets the suggestions from the database and adds them to the current state
  */

  getSearchSuggestions(term) {
    console.log(this.state.text);
    // GET request for movies
    axios
      .get('/api/searchgames', {
        params: {
          term: term
        }
      })
      .then(
        function(response) {
          console.log(response.data);
          movieArray = response.data;
          console.log(movieArray);
          this.setState({ text: movieArray });
          suggestionsLoaded = true;
        }.bind(this)
      );
  }

  suggestionClicked(object) {
    this.props.goMovie(object);
    this.setState({ text: [] });
    this.setState({ term: '' });
  }

  render() {
    return (
      <div className="GameSearchBar">
        <div className="active-pink-3 active-pink-4 mb-4">
          <input
            className="form-control effect-8"
            type="text"
            placeholder="Search"
            aria-label="Search"
            value={this.state.term}
            onChange={this.onInputChange}
          />
        </div>
        <div id="suggest-list">
          {this.state.text
            .slice(0, 5)
            .map(x => (
              <SearchSuggestionItem
                name={x.name}
                func={this.suggestionClicked}
                object={x}
              />
            ))}
        </div>
      </div>
    );
  }
}
