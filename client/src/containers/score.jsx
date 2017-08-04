import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ScoreList from './scoreList.jsx';
import {Button} from 'react-bootstrap';

class Score extends React.Component {
  render() {
    console.log(this.props.topTen);
    return (
      <div className = 'scorePage'>
        <img src="assets/pics/logoTest.png" height = "250" width="1100" className ='logo'></img>
        <div className='hiscoreContainer'>
          <ScoreList />
        </div>
        <div className='endingContainer'>
          <Link to='/'><Button className="endChoiceBtn" >
            <h3>Play Again!</h3>
          </Button></Link>
          <a id="logoutBtn" href='/logout'>
            <div className="logoutChoiceBtn">
              <h3>Logout</h3>
            </div>
          </a>
        </div>
      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {
    topTen: state.topTen
  };
};

export default connect(mapStateToProps)(Score);
