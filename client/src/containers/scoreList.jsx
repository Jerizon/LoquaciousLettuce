import React from 'react';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectUser} from '../actions/index';
import {showModal} from '../actions/index';
import {closeModal} from '../actions/index';
import {Button, Modal} from 'react-bootstrap';
import {getTopTenScores} from '../actions/index';

class ScoreList extends React.Component {

  createScoreListEntries() {

    var sorted = this.props.topTenScoresUsers.sort( (a, b) => {
      return b.score - a.score;
    });
    // this.props.selectUser(user) line 25

    return sorted.map((user, index) => {
      // console.log(user.id);
      return (

        <div key={index} >

          <li key={user.id.toString()} onClick={() => { this.props.selectUser(user); this.props.showModal({visibility: true, user: user, score:this.props.topTenScores[index]}); } }>

              <div id="items" className="col-sm-6-offset-3">
              <div id="scoreList" className="col-sm-8">
                <img id="userImage" src={user.image} height="45" width="45"/>
                  {user.username}
                </div>


                <div id="score">{this.props.topTenScores[index]}<br></br></div>
              </div>


          </li>

        </div>
      );
    });
  }

  render () {
    // var selectUser = this.props.selectUser.bind(this);
    // var showModal = this.props.showModal.bind(this);
    // var closeModal = this.props.closeModal.bind(this);

    return (
      <div>
        <ol>
          <div>
            <Modal id="modals" show={this.props.showScoreModal.visibility} onHide={ () => this.props.closeModal({visibility: false, user: {username:'julia'}}) }>
              <Modal.Header closeButton>
                <Modal.Title> {this.props.showScoreModal.user.username} RANKING: ROCKSTAR </Modal.Title>
              </Modal.Header>
              <Modal.Body >
                <div id="modPic" className="col-sm-4"><img src={this.props.showScoreModal.user.image} height="160" width="160"/></div>
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
    topTenScoresUsers: state.topTenScoresUsers,
    showScoreModal: state.showScoreModal,
    topTenScores: state.topTenScores
  };
};

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators({selectUser: selectUser, showModal: showModal, closeModal: closeModal, getTopTenScores: getTopTenScores}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScoreList);

