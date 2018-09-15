import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import {
  Button,
  Modal,
  OverlayTrigger,
  Tooltip,
  Popover
} from 'react-bootstrap';
import Main from './Main.js';
import Login from './Login.js';
import Signup from './Signup.js';

import '../CSS/landing.css';

const axios = require('axios');

export default class Landing extends Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );
    const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;
    return (
      <div className="landing-container">
        <div>
          <div className="main-bg">
            <img className="logo" src={require('../imgs/logo.png')} />
            <div className="hero">
              <h1 className="text-center">FIND YOUR NEXT</h1>
              <h1 className="text-center">GAMING BUDDY</h1>
              <div className="btn-container">
                <a onClick={this.handleShow} className="btn">
                  Find Gamers
                </a>
              </div>
            </div>
          </div>
          <div className="dim-bg" />
        </div>
        {/*<!-- modal -->*/}

        <div>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title />
            </Modal.Header>
            <Modal.Body>
              <Main />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
