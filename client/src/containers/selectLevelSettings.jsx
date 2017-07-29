import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Button, ButtonGroup} from 'react-bootstrap';
import {changeDifficulty, changeView} from '../actions/index';

class SelectLevelSettings extends React.Component {

  render() {
    var woosh = new Audio("assets/sfx/Woosh.wav");
    woosh.play(); 
    var changeDiff = this.props.changeDifficulty.bind(this);
    var changeView = this.props.changeView.bind(this);
    var click = new Audio("assets/sfx/Click.mp3"); 
    return (
      <div className = 'selectLevelPage'>
        <div className="container">
          <div className="row">
            <div id="lvlSettingsBox" className="col-sm-12" style={{background:'#1a1a1a', height: 280}}>Level<br></br>

              <ButtonGroup vertical className="col-sm-12">
                <Button className="levelChoiceBtn" onClick={()=> {changeDiff('super_beginner'); changeView('song'); click.play(); } } >Super Beginner</Button>
                <Button className="levelChoiceBtn" onClick={()=> {changeDiff('beginner'); changeView('song'); click.play(); } }>Beginner</Button>
                <Button className="levelChoiceBtn" onClick={()=> {changeDiff('intermediate'); changeView('song'); click.play(); } }>Intermediate</Button>
                <Button className="levelChoiceBtn" onClick={()=> {changeDiff('advanced'); changeView('song'); click.play(); } }>Advanced</Button>
                <Button className="levelChoiceBtn" onClick={()=> {changeDiff('rockstar'); changeView('song'); click.play(); } }>RockStar</Button>
              </ButtonGroup>
              <Button className="levelChoiceBtn" onClick={()=> {changeView('players');}}>Back</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {
    game: state.game
  };
};

var matchDispatchToProps = (dispatch) => {
  return bindActionCreators({changeDifficulty: changeDifficulty, changeView: changeView}, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(SelectLevelSettings);
