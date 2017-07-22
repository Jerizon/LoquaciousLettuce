import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {changeView} from '../actions/index.js';
import {Button, ButtonGroup, Navbar, FormGroup, FormControl, Tabs, Tab} from 'react-bootstrap';
import axios from 'axios';
import MusicTrackList from './MusicTrackList.jsx';
import {getTracks} from '../actions/index';

class MusicSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    },
    this.search = '';
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
    this.props.getTracks(FETCH_URL, myOptions);
  }

  getInitialState() {
    return {
      key: 1
    };
  }

  handleSelect(key) {
    this.setState({key});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.search = this.input.value;
    this.getToken();
  }

  render() {
    var changeView = this.props.changeView.bind(this);
    return (
      <div className = 'musicSettingsPage'>
      Select Your Music<br></br>
        <div className="col-sm-12" style={{ background: 'white', height: 550}}>
          <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
            <Tab eventKey={1} title="Library">
            </Tab>
            <Tab eventKey={2} title="Find Track">
              <Navbar>
                <Navbar.Collapse>
                  <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="search-container">
                      Song Name:
                      <input type="text" placeholder={'Song Name'} ref={(input) => this.input = input} />
                      <input type="submit" value="Search!"/>
                    </div>
                  </form>
                </Navbar.Collapse>
              </Navbar>
              <MusicTrackList className = 'container'></MusicTrackList>
            </Tab>
          </Tabs>
        </div>
        <Button onClick={ () => { changeView('difficulty'); } }>Back</Button>
        <Button onClick={ () => { changeView('difficulty'); } }>Waiting for Kevin to kick Spotify's butt. Go Kevin!!!</Button>
        <Button onClick={ () => { changeView('players')} }><Link to='/game'>Play!</Link></Button>
              <Button onClick={ () => { changeView('players'); } }><Link to='/multiPlayer'>MultiPlayer</Link></Button>

      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {
    music: state.music
  };
};

var matchDispatchToProps = (dispatch) => {
  return bindActionCreators({changeView: changeView, getTracks: getTracks}, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(MusicSettings);
