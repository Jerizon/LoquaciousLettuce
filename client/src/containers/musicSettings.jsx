import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {changeView, changeSong, changeBlob} from '../actions/index.js';
import {Button, ButtonGroup, Navbar, FormGroup, FormControl, Tabs, Tab} from 'react-bootstrap';
import axios from 'axios';
import MusicTrackList from './MusicTrackList.jsx';
import MusicTrackListLib from './MusicTrackListLib.jsx';
import {getTracks, getYoutube} from '../actions/index';
import PageTransition from 'react-router-page-transition';
import youtube from '../../../config/development.json';

class MusicSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      youtubeSearch: '',
      key: 1
    },
    this.search = '';
    // this.youtubeSearch = '';
    this.getAudioTrackID = this.getAudioTrackID.bind(this);
    this.getToken = this.getToken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getToken() {
    axios({
      method: 'get',
      url: '/tokenhere',
      contentType: 'json'
    })
    .then((response) => {
      var res = response;
      var accessToken = res.data.accessToken + '&refresh_token=' + res.data.refreshToken;
      this.getAudioTrackID(accessToken);
      // this.getAudioBPM(accessToken);
    });
  }

  getAudioTrackID(token) {

    const BASE_URL = 'https://api.spotify.com/v1/search?';
    const FETCH_URL = BASE_URL + 'q=' + this.search + '&type=track&limit=5';
    var accessToken = token;

    var myOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      mode: 'cors',
      cache: 'default'
    };
    var youtubeOptions = {
      method: 'GET',
      params: {
        key: youtube.youtubeKey.key,
        q: this.search,
        type: 'video',
        part: 'snippet',
        maxResults: 1,
        videoEmbeddable: 'true'
      },
      responseType: 'json'
    };
    this.props.getYoutube(youtubeOptions);
    this.props.getTracks(FETCH_URL, myOptions);
    // this.props.getYoutube
  }


  handleSubmit(event) {
    event.preventDefault();
    this.search = this.input.value;
    this.getToken();
  }

  handleYoutube(event) {
    event.preventDefault();
    console.log(this.youtubeInput.value);
    console.log('this is the youtube search link', this.state.youtubeSearch);
  }

  youtubeSearch(event) {
    var file = document.getElementById("music");
    var context = this;
    file.onchange = function() {
      var files = file.files;
      if (!!files[0]){
        context.props.changeBlob(URL.createObjectURL(files[0]));
      }
    };
    file.onchange();
  }
  
  libraryTab() {
    this.setState({
      key: 1
    });
  }

  searchTab() {
    this.setState({
      key: 2
    });
  }

  render() {
    var woosh = new Audio("assets/sfx/Woosh.wav");
    woosh.play(); 
    var click = new Audio("assets/sfx/Click.mp3");
    var youtubeBind = this.youtubeSearch.bind(this);
    var changeView = this.props.changeView.bind(this);
    return (
      <div className = 'musicSettingsPage transition-item music-setting'>
        <div className = 'musicSettingContainer'>
          <div className = 'musicChoiceContainer'>
            <div className = 'musicSearchBarContainer'>
              <div className = 'libraryTab' onClick={this.libraryTab.bind(this)}>
                <h3>Library</h3>
              </div>
              <div className='searchTab' onClick={this.searchTab.bind(this)}>
                <h3>Search For Music</h3>
              </div>
            </div>
            <div className="musicSettingPageContainer">
              {this.state.key === 1 ? 
                <MusicTrackListLib view = {this.state.key} className = 'container'></MusicTrackListLib>
              :
                <div>
                  <div className = 'spotifySearch'>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                      <div className="search-container">
                        <div className='searchSpot'>
                          <div className = "spotifySearchTitle">
                            <h4>Search Song:</h4>
                          </div>
                          <input className='inputQuery' type="text" placeholder={'Song Name'} ref={(input) => this.input = input} />
                          <input className='searchQuery' type="submit" value="Search!"/>
                        </div>
                        <div className='searchYoutube'>
                          <div className='dlLinkContainer'>
                            <h4>DL Link</h4>
                          </div>
                          <div className='iframeContainer'>
                            <iframe id ='test' style={{width: 150, height: 50, border: 0, overflow: 'hidden', color: 'lightblue'}} scrolling="no" src={this.props.youtube.youtubeLink}/>    
                          </div>
                        </div>
                      </div>
                    </form>   
                  </div> 
                  <MusicTrackList view = {this.state.key} className = 'container'></MusicTrackList>
                </div>
              }
            </div>
          </div>
          <div className='settingInput'>
            <div className='settingInputTextContainer'>
              <h5>Click on White to Upload MP3 -></h5>
            </div>
            <input className='uploadButton' type="file" id="music" accept="audio/*"/>
          </div>
          <div className = 'musicBack'>
            <div className="levelChoiceBtn" onClick={ () => { changeView('difficulty'); } }>
              <h3>Back</h3>
            </div> 
          </div>
          <div className = 'musicPlay'>
            {
              this.props.game.players === 1 &&
              <Link to='/game' style={{textDecoration: 'none'}}><div className="levelChoiceBtn" onClick = {()=> { youtubeBind(); changeView('players');  } }>
                <h3>Play!</h3>
              </div></Link>
            }
            {
              this.props.game.players === 2 &&
              <Link to='/multiPlayer' style={{textDecoration: 'none'}}><div className="levelChoiceBtn" onClick={()=> { youtubeBind(); changeView('players'); } }>
                <h3>Play!</h3>
              </div></Link>
            }
          </div>
        </div>
      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {
    music: state.music,
    youtube: state.youtube,
    game: state.game,
  };
};

var matchDispatchToProps = (dispatch) => {
  return bindActionCreators({changeView: changeView, getTracks: getTracks, getYoutube: getYoutube, changeSong: changeSong, changeBlob: changeBlob}, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(MusicSettings);

