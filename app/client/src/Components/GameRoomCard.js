import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Label,
  Modal,
  Card,
  Image,
  Icon,
  Header,
  Form,
  Input,
  TextArea,
  Button
} from 'semantic-ui-react';
import { addProfile } from '../Actions/actions';

const axios = require('axios');

class GameRoomCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      liked: false,
      likes: this.props.object.likes,
      likeRunning: false,
      modalOpen: false,
      loaded: false
    };
    this.onGamertagClick = this.onGamertagClick.bind(this);
    this.likeClick = this.likeClick.bind(this);
    this.getLikes = this.getLikes.bind(this);
  }

  componentWillMount() {
    axios.get('/api/getCurrentUser/id').then(
      function(response) {
        console.log(response.data);
        console.log(this.props.object.likerArray);

        var id = response.data;
        var likerArray = this.props.object.likerArray;

        if (likerArray.indexOf(id) > -1) {
          console.log('id in likerArray');
          this.setState({ liked: true });
        } else {
          console.log('id is not in likerArray');
          this.setState({ liked: false });
        }
      }.bind(this)
    );
  }

  onGamertagClick() {
    this.setState({ redirect: true });
  }

  getLikes() {}

  likeClick() {
    this.setState({
      likeRunning: true
    });

    if (this.state.liked) {
      console.log('ALRAEADY IN LIKERARRAY');
      axios
        .post('/api/gameRoom/removeLike', {
          params: {
            gameRoom: this.props.object
          }
        })
        .then(
          function(response) {
            console.log(response.data);
            this.setState({
              likeRunning: response.data
            });
          }.bind(this)
        );
      this.setState({
        liked: false,
        likes: this.state.likes - 1
      });
    } else {
      axios
        .post('/api/gameRoom/addLike', {
          params: {
            gameRoom: this.props.object
          }
        })
        .then(
          function(response) {
            console.log(response.data);
            this.setState({
              likeRunning: response.data
            });
          }.bind(this)
        );
      this.setState({
        liked: true,
        likes: this.state.likes + 1
      });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={'/profile/' + this.props.object.gamertag} />;
    }

    console.log(this.props.object.time.substring(0, 10));
    console.log(this.props.object.game[0].name);

    return (
      <div
        style={this.state.loaded ? {} : { display: 'none' }}
        className="card-div bounce"
      >
        <img
          onLoad={() => this.setState({ loaded: true })}
          src={this.props.object.avatar}
        />
        <div id="overlay">
          <div className="card-top">
            <p>{this.props.object.game[0].name}</p>
            <div className="gamertag-container">
              <h3 className="effect-underline" onClick={this.onGamertagClick}>
                {this.props.object.gamertag}
              </h3>
            </div>
          </div>
          <div className="card-bottom">
            <h2>{this.props.object.title}</h2>
            <Button
              disabled={this.state.likeRunning}
              className={this.state.liked ? 'liked' : 'not-liked'}
              onClick={this.likeClick}
            >
              <i className="fas fa-heart" />
              {' ' + this.state.likes} Likes
            </Button>

            <span
              className="grow"
              onClick={() => {
                this.setState({ modalOpen: true });
              }}
            >
              More...
            </span>
          </div>
        </div>
        <Modal open={this.state.modalOpen}>
          <Modal.Header>
            {this.props.object.title}
            <i
              onClick={() => {
                this.setState({ modalOpen: false });
              }}
              className="fas fa-times"
            />
          </Modal.Header>
          <Modal.Content image>
            <p>Message them on discord:</p>
            <p>{this.props.object.discord}</p>
            <p>Description:</p>
            <p>{this.props.object.desc}</p>
          </Modal.Content>
        </Modal>
      </div>
      /*
      <Card>
        <Modal
          open={this.state.modalOpen}
          trigger={
            <img
              onClick={() => {
                this.setState({ modalOpen: true });
              }}
              className="logo"
              src={require('../imgs/uploads' + this.props.object.avatar)}
            />
          }
        >
          <Modal.Header>
            {this.props.object.title}
            <i
              onClick={() => {
                this.setState({ modalOpen: false });
              }}
              className="fas fa-times"
            />
          </Modal.Header>
          <Modal.Content image>
            <img
              className="logo"
              src={require('../imgs/uploads' + this.props.object.avatar)}
            />
          </Modal.Content>
        </Modal>
        <Card.Content>
          <Card.Header>{this.props.object.title}</Card.Header>
          <Card.Meta onClick={this.onGamertagClick}>
            <span className="date">{this.props.object.gamertag}</span>
            <span className="date">{this.props.object.discord}</span>
          </Card.Meta>
          <Card.Description>{this.props.object.desc}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button
            disabled={this.state.likeRunning}
            className={this.state.liked ? 'liked' : 'not-liked'}
            onClick={this.likeClick}
          >
            <i className="fas fa-heart" />
            {' ' + this.state.likes} Likes
          </Button>
        </Card.Content>
      </Card>
      */
    );
  }
}

const mapStateToProps = state => {
  return {
    profiles: state.profileArray
  };
};

const mapDispatchToProps = dispatch => {
  console.log(dispatch);
  return bindActionCreators({ addProfile: addProfile }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(GameRoomCard);
