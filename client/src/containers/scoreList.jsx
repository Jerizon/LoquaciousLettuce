import React from 'react';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectUser} from '../actions/index';
import {showModal} from '../actions/index';
import {closeModal} from '../actions/index';
import {Button, Modal} from 'react-bootstrap';
import {getTopGames} from '../actions/index';

class ScoreList extends React.Component {
  // componentWillMount () {
  //   console.log('top games on mount', this.props.topTen);
  //   //query for the top 10
  //   this.props.getTopGames(this.props.game);
  // }
  createScoreListEntries() {
    console.log('top games --->', this.props.topTen);
    var topTen = this.props.topTen;
    if (topTen.length >= 10) {
      topTen = topTen.slice(0, 10);
    }
    return topTen.map((game, index) => {
      var user = game.profiles;
      return (

        <div key={index}>
          <div onClick={() => { this.props.selectUser(user); this.props.showModal({visibility: true, user: user, score: game.score}); } }>
            <div className="items">
              <div className='scoreIndexContainer'>
                <h4>{(index + 1) + '.'}</h4>
              </div>
              <div className='scoreImageContainer'>
                <img className="userImage" src={user.imageurl}/>
              </div>
              <div className='scoreDisplayContainer'>
                <h7>{user.display}</h7>
              </div>
              <div className ='scoreScoreContainer'>
                <h6>{game.score}</h6>
              </div>    
            </div>
          </div>
        </div>
      );
    });
  }
  createStars(numberOfStars) {
    var astrolab = [];
    for (var i = 0; i < numberOfStars; i++) {
      astrolab.push('★');
    }
    return <span>{astrolab}</span>;
  }

  render () {
    // console.log('stars', this.props.showScoreModal.stats.games[0].numGamesDifficulty);
    // console.log('scores', this.props.showScoreModal.stats.games[0].topScoreDifficulty);
    //{this.props.showScoreModal.stats.games[0].numGamesDifficulty[1]}
    var createStars = this.createStars.bind(this);
    return (
      <div>
        <div>
          <div>
            <Modal id="modals" show={this.props.showScoreModal.visibility} onHide={ () => this.props.closeModal({visibility: false, user: {display: 'julia'}, stats: {games: []}}) }>
              <Modal.Header closeButton>
                <Modal.Title id="modalTitle"> <span id="modalTitleUserName">{this.props.showScoreModal.user.display} </span>RANK: {this.props.showScoreModal.stats.games[0].playerRanking} </Modal.Title>
              </Modal.Header>
              <Modal.Body >
                <div id="modPic" className="col-sm-4"><img src={this.props.showScoreModal.user.imageurl} height="160" width="160"/></div>
                <div id="lvls" className="col-sm-6">
                  <div> STATS </div>
                  Super Beginner: {createStars(this.props.showScoreModal.stats.games[0].numGamesDifficulty[1])} <br></br>
                  Beginner: {createStars(this.props.showScoreModal.stats.games[0].numGamesDifficulty[2])}<br></br>
                  Intermediate: {createStars(this.props.showScoreModal.stats.games[0].numGamesDifficulty[3])}<br></br>
                  Advanced: {createStars(this.props.showScoreModal.stats.games[0].numGamesDifficulty[4])}<br></br>
                  Rockstar: {createStars(this.props.showScoreModal.stats.games[0].numGamesDifficulty[5])}<br></br>
                </div>

                <span id="scr" className="col-sm-2"> highscores: <br></br>
                  {this.props.showScoreModal.stats.games[0].topScoreDifficulty[1]} <br></br>
                  {this.props.showScoreModal.stats.games[0].topScoreDifficulty[2]} <br></br>
                  {this.props.showScoreModal.stats.games[0].topScoreDifficulty[3]} <br></br>
                  {this.props.showScoreModal.stats.games[0].topScoreDifficulty[4]} <br></br>
                  {this.props.showScoreModal.stats.games[0].topScoreDifficulty[5]} <br></br>
                </span>

              </Modal.Body>
            </Modal>
          </div>
            {this.createScoreListEntries()}
        </div>
      </div>
    );
  }
}


var mapStateToProps = (state) => {
  return {
    showScoreModal: state.showScoreModal,
    topTen: state.topTen,
    game: state.game
  };
};

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators({selectUser: selectUser, showModal: showModal, closeModal: closeModal, getTopGames: getTopGames}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScoreList);

