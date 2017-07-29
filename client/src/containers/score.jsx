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
        <Link to='/'><Button className="levelChoiceBtn" >PLAY AGAIN!</Button></Link>
        <Button id="logoutBtn" href="/logout" className="levelChoiceBtn" >Logout</Button>
        <br></br>
          <ScoreList key={this.props.topTenScoresUsers.id}/>
      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {
    topTenScoresUsers: state.topTenScoresUsers
  };
};

export default connect(mapStateToProps)(Score);
