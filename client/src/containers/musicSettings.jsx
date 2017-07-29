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


class MusicSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      youtubeSearch: ''
    },
    this.search = '';
    // this.youtubeSearch = '';
    this.getAudioTrackID = this.getAudioTrackID.bind(this);
    this.getToken = this.getToken.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
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
        key: '',
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

  getInitialState() {
    return {
      key: 1
    };
  }

  handleSelect(key) {
    console.log(key);
    this.setState({
      key: key
    });
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
      var files = this.files;
      console.log('SONG BLOB HERE', URL.createObjectURL(files[0]));
      //var sound = new Audio(URL.createObjectURL(files[0]));
      context.props.changeBlob(URL.createObjectURL(files[0]));
      //sound.play();
    };
    file.onchange();
    // audio.
  }

  render() {
    var changeView = this.props.changeView.bind(this);
    return (
      <div className = 'musicSettingsPage transition-item music-setting'>
      Select Your Music<br></br>
      <Button onClick = {this.youtubeSearch.bind(this)}>HEHLLO</Button>
        <div id="content">
          <input type="file" id="music" accept="audio/*" />
        </div>
        <div className="col-sm-12" style={{ background: 'white', height: 550}}>
          <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
            <Tab eventKey={1} title="Library">
              <MusicTrackListLib view = {this.state.key} className = 'container'></MusicTrackListLib>
            </Tab>
            
            <Tab eventKey={2} title="Find Track">
              <Navbar>
                <Navbar.Collapse>
                  <span>
                  <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="search-container">
                      Song Name:
                      <input type="text" placeholder={'Song Name'} ref={(input) => this.input = input} />
                      <input type="submit" value="Search!"/>
                    </div>
                  </form>
                    <iframe id ='test'style={{width: 230, height: 60, border: 0, overflow: 'hidden'}} scrolling="no" src={this.props.youtube.youtubeLink}/>                  
                  </span>
                </Navbar.Collapse>
              </Navbar>
              <MusicTrackList view = {this.state.key} className = 'container'></MusicTrackList>
            </Tab>
          </Tabs>
        </div>
        <Button onClick={ () => { changeView('difficulty'); } }>Back</Button>
        <Button onClick={ () => { changeView('difficulty'); } }>Waiting for Kevin to kick Spotify's butt. Go Kevin!!!</Button>
        <Button onClick={ () => { changeView('players'); } }><Link to='/game'>Play!</Link></Button>
        <Button onClick={ () => { changeView('players'); } }><Link to='/multiPlayer'>MultiPlayer</Link></Button>
      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {
    music: state.music,
    youtube: state.youtube
  };
};

var matchDispatchToProps = (dispatch) => {
  return bindActionCreators({changeView: changeView, getTracks: getTracks, getYoutube: getYoutube, changeSong: changeSong, changeBlob: changeBlob}, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(MusicSettings);
