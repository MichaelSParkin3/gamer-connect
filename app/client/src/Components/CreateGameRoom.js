import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import {
  Icon,
  Label,
  Modal,
  Image,
  Header,
  Form,
  Input,
  TextArea,
  Button
} from 'semantic-ui-react';

import GameSearchBar from './GameSearchBar';

import '../CSS/create-game-room.css';

const axios = require('axios');

export default class CreateGameRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      desc: '',
      game: null,
      discord: ''
    };

    this.onItemSelect = this.onItemSelect.bind(this);
    this.submit = this.submit.bind(this);
  }

  onItemSelect(object) {
    console.log(object);
    this.setState({ game: object });
  }

  submit() {
    console.log('lol');

    axios
      .post('/api/gameRoom', {
        params: {
          title: this.state.title,
          game: this.state.game,
          desc: this.state.desc,
          discord: this.state.discord
        }
      })
      .then(
        function(response) {
          console.log(response.data);
        }.bind(this)
      );
  }

  render() {
    return (
      <div className="create-game-room-container">
        <Modal trigger={<Button>Create Game Room</Button>}>
          <Modal.Header>Create Game Room</Modal.Header>
          <Modal.Content image>
            <GameSearchBar goMovie={this.onItemSelect} />
            <Form onSubmit={this.submit}>
              <Form.Field
                id="form-input-control-first-name"
                control={Input}
                label="First name"
                placeholder="First name"
                onChange={e => {
                  this.setState({ title: e.target.value });
                }}
                value={this.state.title}
              />

              <Form.Field
                id="form-input-control-discord-name"
                control={Input}
                label="Discord ID"
                placeholder="Discord ID"
                onChange={e => {
                  this.setState({ discord: e.target.value });
                }}
                value={this.state.discord}
              />

              <Form.Field
                id="form-textarea-control-opinion"
                control={TextArea}
                label="Opinion"
                placeholder="Opinion"
                onChange={e => {
                  this.setState({ desc: e.target.value });
                }}
                value={this.state.desc}
              />
              <Form.Field
                id="form-button-control-public"
                control={Button}
                content="Create"
              />
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
