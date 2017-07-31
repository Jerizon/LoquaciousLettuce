import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import SelectPlayerSettings from './selectPlayerSettings.jsx';
import SelectLevelSettings from './selectLevelSettings.jsx';
import MusicSettings from './musicSettings.jsx';
import {Button, ButtonGroup} from 'react-bootstrap';
import {getCurrentUser} from '../actions/index';
import {getActiveProfile} from '../actions/index';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songPlay: true,
      background: null,
    };
  }

  changeSongState() {
    this.setState({songPlay: false});
  }

  render() {
    console.log('THIS IS VIEW', this.props.view);
    var background = new Audio('assets/sfx/background.mp3');
    console.log(this.state.songPlay);
    if (this.state.songPlay === true) {
      background.volume = 0.2;
      background.id = 'background';

      window.background = background;
      background.play();

      this.changeSongState();
    }
    return (
      <div>
        <div id="settingsTitle" className="col-sm-4 col-sm-offset-4">Tessell8</div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
          <div>
            <div className="settingsPage">Settings Page</div>
            <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
            {this.props.view === 'players' ?
              <div key = {'players'}>
                Player Count
                <SelectPlayerSettings className="playerMode"/>
              </div>
            : this.props.view === 'song' ?
              <div key = {'song'}>
                Music Settings
                <MusicSettings background={this.state.background}/>
              </div>
            : this.props.view === 'difficulty' ?
              <div key = {'difficulty'}>
              Level Settings
                <SelectLevelSettings background={this.state.background}/>
              </div>
            : <div key = {'noview'}>
                No View is Selected
              </div>}
              </ReactCSSTransitionGroup>
            </div>
      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {
    view: state.view
  };
};

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators({getCurrentUser: getCurrentUser}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);