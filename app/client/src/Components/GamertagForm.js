import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import SearchSuggestionItem from './SearchSuggestionItem';
import $ from 'jquery';

const axios = require('axios');

var suggestionsLoaded = false;
var isTimerRunning = false;
var typeTimer;
var searchTerm;

export default class GamertagForm extends Component {
  constructor(props) {
    super(props);

    this.state = { inputClass: 'form-control', isDupe: null };

    this.checkGamertag = this.checkGamertag.bind(this);
    this.checkDuplicate = this.checkDuplicate.bind(this);
  }

  onInputChange(event) {
    this.props.tagToParent(event.target.value);
    searchTerm = event.target.value;
    if (isTimerRunning == false) {
      isTimerRunning = true;
      typeTimer = setTimeout(() => {
        this.checkDuplicate(searchTerm);
        isTimerRunning = false;
      }, 500);
    } else {
      console.log('Timer is Runnoing');
      clearTimeout(typeTimer);
      typeTimer = setTimeout(() => {
        this.checkDuplicate(searchTerm);
        isTimerRunning = false;
      }, 500);
    }
  }

  checkDuplicate(gamertag) {
    axios
      .get('/api/checkduplicate', {
        params: {
          gamertag: gamertag
        }
      })
      .then(
        function(response) {
          console.log(response.data);
          if (response.data) {
            this.checkGamertag(gamertag);
          } else {
            this.setState({ inputClass: 'invalidInput form-control' });
            this.props.showButtons(false);
          }
        }.bind(this)
      );
  }

  checkGamertag(gamertag) {
    console.log(gamertag);
    var gamertagRegex = new RegExp('^[a-zA-Z0-9_ ]{3,16}$');
    if (gamertagRegex.test(gamertag)) {
      console.log('pass');
      this.setState({ inputClass: 'validInput form-control' });
      this.props.showButtons(true);
    } else {
      this.setState({ inputClass: 'invalidInput form-control' });
      this.props.showButtons(false);
    }
  }

  render() {
    return (
      <div className="">
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <div className="form-group">
            <label for="gamertagInput">Gamertag</label>
            <input
              type="username"
              className={this.state.inputClass}
              id="gamertagInput"
              aria-describedby="emailHelp"
              placeholder="Enter gamertag"
              value={this.props.gamertag}
              onChange={e => {
                this.onInputChange(e);
              }}
            />
            <small id="emailHelp" className="form-text text-muted">
              This is the badass name gamers know you by.
            </small>
          </div>
        </form>
      </div>
    );
  }
}
