import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ScoreList from './scoreList.jsx';
import {Button} from 'react-bootstrap';

class Score extends React.Component {
  render() {
    return (

      <div className = 'scorePage'>
      <div id="title">TESSELL8</div>
        <div id="highScore">HIGH SCORE</div>
        <Button><Link to='/'>PLAY AGAIN!</Link></Button>
        <a id="logoutBtn" href="/logout" className="btn btn-default btn-sm">Logout</a>
        <br></br>
          <ScoreList key={this.props.users.id}/>
      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {
    users: state.users
  };
};

export default connect(mapStateToProps)(Score);
