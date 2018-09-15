import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

const axios = require('axios');

export default class SexForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            value="male"
            checked={this.props.sex === 'male'}
            onChange={this.props.handleChange}
            onClick={() => {
              this.props.showButtons(true);
            }}
          />
          <label className="form-check-label" for="exampleRadios1">
            Male
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            value="female"
            checked={this.props.sex === 'female'}
            onChange={this.props.handleChange}
            onClick={() => {
              this.props.showButtons(true);
            }}
          />
          <label className="form-check-label" for="exampleRadios2">
            Female
          </label>
        </div>
      </div>
    );
  }
}
