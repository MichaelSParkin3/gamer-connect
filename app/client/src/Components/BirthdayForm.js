import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

const axios = require('axios');

export default class GamertagForm extends Component {
  constructor(props) {
    super(props);

    this.state = { inputClass: 'form-control' };

    this.birthdaySelectedHandler = this.birthdaySelectedHandler.bind(this);
  }

  birthdaySelectedHandler(event) {
    this.props.updateBirthday(event.target.value);
    this.props.showButtons(true);
  }

  render() {
    return (
      <form>
        <div className="form-group">
          <label for="birthDate" className="col-sm-3 control-label">
            Date of Birth
          </label>
          <div className="col-sm-9">
            <input
              type="date"
              onChange={this.birthdaySelectedHandler}
              id="birthDate"
              className="form-control"
            />
          </div>
        </div>
      </form>
    );
  }
}
