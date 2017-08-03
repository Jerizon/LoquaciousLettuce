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
      topTen = topTen.slice(0,10);
    }
    return topTen.map((game, index) => {
      var user = game.profiles;
      // var id = game.id || user.id;
      return (

        <div key={index} >

          <li onClick={() => { this.props.selectUser(user); this.props.showModal({visibility: true, user: user, score: game.score}); } }>

              <div id="items" className="col-sm-6-offset-3">
              <div id="scoreList" className="col-sm-8">
                <img id="userImage" src={user.imageurl} height="45" width="45"/>
                  {user.display}
                </div>
                <div id="score">{game.score}<br></br></div>
              </div>
          </li>

        </div>
      );
    });
  }

  render () {
    return (
      <div>
        <ol>
          <div>
            <Modal id="modals" show={this.props.showScoreModal.visibility} onHide={ () => this.props.closeModal({visibility: false, user: {username:'julia'}}) }>
              <Modal.Header closeButton>
                <Modal.Title> {this.props.showScoreModal.user.display} RANKING: ROCKSTAR </Modal.Title>
              </Modal.Header>
              <Modal.Body >
                <div id="modPic" className="col-sm-4"><img src={this.props.showScoreModal.user.imageurl} height="160" width="160"/></div>
                <div id="lvl" className="col-sm-6">
                  <div> STATS </div>
                  Super Beginner: <br></br>
                  Beginner: <br></br>
                  Intermediate: <br></br>
                  Advanced: <br></br>
                  Rockstar: <br></br>
                </div>

                <div id="scr" className="col-sm-2"> highscores: {this.props.showScoreModal.score}</div>

              </Modal.Body>
              <Modal.Footer>
               footer
              </Modal.Footer>
            </Modal>
          </div>
            {this.createScoreListEntries()}
        </ol>
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

