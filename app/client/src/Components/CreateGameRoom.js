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
import GameList from './GameList';

import '../CSS/create-game-room.css';

const axios = require('axios');

export default class CreateGameRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      desc: null,
      game: [],
      discord: null,
      titleEmpty: false,
      gameEmpty: false,
      descEmpty: false,
      discordEmpty: false,
      modalOpen: false
    };

    this.onItemSelect = this.onItemSelect.bind(this);
    this.submit = this.submit.bind(this);
  }

  onItemSelect(object) {
    console.log(object);
    var emptyArray = [];
    var joined = emptyArray.concat(object);
    this.setState({ game: joined });
  }

  submit() {
    if (this.state.title.length > 30) {
      this.setState({ titleEmpty: true });
    }
    if (this.state.desc.length > 150) {
      this.setState({ descEmpty: true });
    }
    if (this.state.discord.length > 30) {
      this.setState({ discordEmpty: true });
    }

    if (
      this.state.title.length > 30 ||
      this.state.desc.length > 30 ||
      this.state.discord.length > 30
    ) {
      return;
    }

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
          this.setState({
            discordEmpty: false,
            descEmpty: false,
            titleEmpty: false,
            gameEmpty: false,
            title: null,
            game: [],
            desc: null,
            discord: null
          });
          this.setState({ modalOpen: false });
          this.props.reload();
          console.log(this.state);
        }.bind(this)
      );
  }

  render() {
    return (
      <div className="create-game-room-container">
        <Button
          className="float"
          onClick={() => {
            this.setState({ modalOpen: true });
          }}
        >
          Create Game Room
        </Button>
        <Modal open={this.state.modalOpen}>
          <Modal.Header>
            Create Game Room<i
              onClick={() => {
                this.setState({ modalOpen: false });
              }}
              className="fas fa-times"
            />
          </Modal.Header>
          <Modal.Content image>
            <GameSearchBar goMovie={this.onItemSelect} />
            <GameList
              sendUp={() => {
                console.log('sendup');
              }}
              games={this.state.game}
              /*showButtons={this.showButtons}*/
            />
            <Form onSubmit={this.submit}>
              <Form.Field
                required
                id="form-input-control-title-name"
                className={
                  this.state.titleEmpty ? 'inputInvalid' : 'inputValid'
                }
                control={Input}
                label="Title"
                placeholder="Title"
                onChange={e => {
                  this.setState({ title: e.target.value });
                }}
                value={this.state.title}
              />

              <Form.Field
                required
                id="form-input-control-discord-name"
                className={
                  this.state.discordEmpty ? 'inputInvalid' : 'inputValid'
                }
                control={Input}
                label="Discord ID"
                placeholder="Discord ID"
                onChange={e => {
                  this.setState({ discord: e.target.value });
                }}
                value={this.state.discord}
              />

              <Form.Field
                required
                id="form-textarea-control-opinion"
                className={this.state.descEmpty ? 'inputInvalid' : 'inputValid'}
                control={TextArea}
                label="Description"
                placeholder="Description"
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
