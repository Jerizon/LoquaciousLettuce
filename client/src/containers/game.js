import React from 'react';
import { Redirect, Link } from 'react-router';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Router, Switch, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //redirectTo: false
    };

  }

  render() {

    return (
      <div className = 'gamePage'>
      gamePage GAME GAME<br></br>
        <Link to='/score'>Score</Link>
      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {

  };
};

export default connect(mapStateToProps)(Game);