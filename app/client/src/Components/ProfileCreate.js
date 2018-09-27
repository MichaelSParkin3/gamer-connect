import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addProfile } from '../Actions/actions';

import GameSearchBar from './GameSearchBar';
import GamertagForm from './GamertagForm';
import BirthdayForm from './BirthdayForm';
import SexForm from './SexForm';
import GameList from './GameList';
import Slider from 'react-slick';

import '../CSS/profile-create.css';

import $ from 'jquery';

const axios = require('axios');

var gamertagRegex = new RegExp('^[a-zA-Z0-9_ ]{3,16}$');

class ProfileCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gamertag: null,
      games: [],
      bio: null,
      sex: null,
      avatar: null,
      age: null,
      birthday: null,
      style: { visibility: 'hidden' },
      redirect: false,
      response: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
    this.addGame = this.addGame.bind(this);
    this.addRank = this.addRank.bind(this);
    //this.saveProfile = this.saveProfile.bind(this);
    this.changeTag = this.changeTag.bind(this);
    this.showButtons = this.showButtons.bind(this);
    this.dataURItoBlob = this.dataURItoBlob.bind(this);
    this.finishButtonClick = this.finishButtonClick.bind(this);
  }

  handleChange(event) {
    this.setState({
      sex: event.target.value
    });
  }

  dataURItoBlob(str) {
    // extract content type and base64 payload from original string
    var pos = str.indexOf(';base64,');
    var type = str.substring(5, pos);
    var b64 = str.substr(pos + 8);

    // decode base64
    var imageContent = atob(b64);

    // create an ArrayBuffer and a view (as unsigned 8-bit)
    var buffer = new ArrayBuffer(imageContent.length);
    var view = new Uint8Array(buffer);

    // fill the view, using the decoded base64
    for (var n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }

    // convert ArrayBuffer to Blob
    var blob = new Blob([buffer], { type: type });

    return blob;
  }

  fileSelectedHandler(event) {
    // this.setState({ avatar: event.target.files[0] }, function() {
    //   console.log(this.state);
    //   this.showButtons(true);
    // });

    var goodDimensions = false;
    var width, height;
    var file = event.target.files[0];

    console.log(event.target.files[0]);
    var img = new Image();

    img.src = window.URL.createObjectURL(event.target.files[0]);

    img.onload = function() {
      width = img.naturalWidth;
      height = img.naturalHeight;

      window.URL.revokeObjectURL(img.src);

      console.log(width);
      console.log(height);
      goodDimensions = true;
      if (width <= 180 && height <= 180) {
        this.setState({ avatar: file }, function() {
          console.log(this.state);
        });
      } else {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.width = 180;
        canvas.height = 180;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 180, 180);

        var base64Image = canvas.toDataURL('image/png');
        console.log(this.dataURItoBlob(base64Image));
        var imgFile = this.dataURItoBlob(base64Image);

        this.setState({ avatar: base64Image }, function() {
          console.log(this.state);
        });

        URL.revokeObjectURL(img.src);
      }
    }.bind(this);

    this.showButtons(true);
  }

  addGame(object) {
    var found = false;
    for (var i = 0; i < this.state.games.length; i++) {
      if (this.state.games[i].name == object.name) {
        found = true;
        break;
      }
    }
    if (!found) {
      var joined = this.state.games.concat(object);
      this.setState({ games: joined });
      console.log(object);
      console.log('added');
      this.showButtons(true);
      console.log('fgh');
    }
  }

  addRank(newRank, gameName) {
    console.log(newRank);
    console.log(gameName);

    var gameArray = this.state.games;

    for (var i = 0; i < gameArray.length; i++) {
      if (gameArray[i].name === gameName) {
        gameArray[i].rank = newRank;
        this.setState({ games: gameArray });
      }
    }

    console.log('cont');

    var gameArray = this.state.games;
    var fullRanks = true;

    //check if all ranks are filled
    for (var i = 0; i < gameArray.length; i++) {
      if (gameArray[i].rank == null) {
        fullRanks = false;
        console.log('rank: ' + gameArray[i].rank);
      }
    }
    if (fullRanks) {
      this.showButtons(true);
    }
  }

  changeTag(newTag) {
    this.setState({ gamertag: newTag });
  }

  showButtons(bool) {
    if (bool) {
      this.setState({ style: { visibility: 'visible' } });
    } else {
      this.setState({ style: { visibility: 'hidden' } });
    }
  }

  finishButtonClick() {
    console.log(this.state);
    axios
      .post('/profile/create', {
        params: {
          gamertag: this.state.gamertag,
          games: this.state.games,
          bio: this.state.bio,
          sex: this.state.sex,
          avatar: this.state.avatar,
          age: this.state.age,
          birthday: this.state.birthday
        }
      })
      .then(
        function(response) {
          console.log(response.data);
          this.props.addProfile(response.data).then(() => {
            this.setState({ redirect: true });
          });
          // this.setState({ response: response.data }, function() {
          //   console.log(this.state);
          //   this.setState({ redirect: true });
          // });
        }.bind(this)
      );

    // // create a string for an HTTP body message
    // var bodyFormData = new FormData();
    // bodyFormData.set('avatar', this.state.avatar);
    //
    // axios({
    //   method: 'post',
    //   url: '/profile/create/image',
    //   data: bodyFormData,
    //   config: {
    //     headers: { 'Content-Type': 'multipart/form-data' }
    //   }
    // }).then(
    //   function(response) {
    //     console.log(response.data);
    //     this.props.addProfile(response.data).then(() => {
    //       this.setState({ redirect: true });
    //     });
    //   }.bind(this)
    // );
  }

  render() {
    if (this.state.redirect) {
      console.log(this.props.profiles.profile.profile.gamertag);
      console.log(this.props.profiles);
      return (
        <Redirect
          to={'/profile/' + this.props.profiles.profile.profile.gamertag}
        />
      );
    }

    var settings = {
      infinite: false,
      arrows: false,
      draggable: false,
      accessibility: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: function(index) {
        console.log(index);
        this.showButtons(false);
        var day;
        switch (index) {
          case 0:
            if (
              gamertagRegex.test(this.state.gamertag) &&
              this.state.gamertag != null
            ) {
              this.showButtons(true);
            }
            break;
          case 1:
            if (this.state.birthday != null) {
              this.showButtons(true);
            }
            break;
          case 2:
            if (this.state.sex != null) {
              this.showButtons(true);
            }
            break;
          case 3:
            if (this.state.games.length > 0) {
              this.showButtons(true);
            }
            break;
          case 4:
            if (this.state.bio != null) {
              this.showButtons(true);
            }
            break;
          case 5:
            if (this.state.avatar != null) {
              this.showButtons(true);
            }
            break;
          case 6:
            day = 'Saturday';
        }
      }.bind(this)
    };

    return (
      <div className="profile-create-container">
        <img className="logo" src={require('../imgs/logo.png')} />
        <div className="creator-container">
          <button
            type="button"
            onClick={() => {
              this.slider.slickPrev();
            }}
            className="prev btn btn-dark"
          >
            <i className="fas fa-angle-left" />
          </button>
          <Slider ref={c => (this.slider = c)} {...settings}>
            {/* Gamertag */}
            <div>
              <h5 className="text-center">Profile</h5>
              <h3 className="text-center">Your Badass Alias</h3>
              <GamertagForm
                showButtons={this.showButtons}
                gamertag={this.state.gamertag}
                tagToParent={this.changeTag}
                nextSlide={() => {
                  this.slider.slickNext();
                }}
              />
            </div>
            <div>
              <h5 className="text-center">Profile</h5>
              <h3 className="text-center">Date Of Birth</h3>
              <BirthdayForm
                updateBirthday={newBirthday => {
                  this.setState({ birthday: newBirthday });
                }}
                showButtons={this.showButtons}
              />
            </div>
            {/* Sex */}
            <div>
              <h5 className="text-center">Profile</h5>
              <h3 className="text-center">Whats your Sex?</h3>
              <SexForm
                showButtons={this.showButtons}
                handleChange={this.handleChange}
                sex={this.state.sex}
              />
            </div>

            {/* Games */}
            <div>
              <h5 className="text-center">Profile</h5>
              <h3 className="text-center">Add Your Main Games</h3>
              <GameSearchBar goMovie={this.addGame} />
              <GameList
                sendUp={this.addRank}
                games={this.state.games}
                /*showButtons={this.showButtons}*/
              />
            </div>
            {/* Bio */}
            <div>
              <h5 className="text-center">Profile</h5>
              <h3 className="text-center">A bit about you</h3>
              <form>
                <div className="form-group">
                  <label for="exampleFormControlTextarea1">Biography</label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    value={this.state.bio}
                    onChange={e => {
                      this.setState({ bio: e.target.value });
                      this.showButtons(true);
                    }}
                  />
                </div>
              </form>
            </div>
            {/* Image Upload */}
            <div>
              <h5 className="text-center">Profile</h5>
              <h3 className="text-center">Your Avatar Image</h3>
              <small>Choose an image with the same width and height</small>
              <form>
                <input
                  type="file"
                  name="pic"
                  accept="image/x-png,image/gif,image/jpeg"
                  onChange={this.fileSelectedHandler}
                />
              </form>
            </div>
            {/* Finish Button */}
            <div>
              <button
                type="button"
                onClick={this.finishButtonClick}
                className="save btn btn-dark"
              >
                Save Profile
              </button>
            </div>
          </Slider>
          <button
            type="button"
            style={this.state.style}
            onClick={() => {
              this.slider.slickNext();
              this.setState({ style: { visibility: 'hidden' } });
            }}
            className="next btn btn-dark"
          >
            NEXT
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profiles: state.profiles
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
)(ProfileCreate);
