import React from 'react';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {selectUser} from '../actions/index';
import {showModal} from '../actions/index';
import {closeModal} from '../actions/index';
import {Button, Modal} from 'react-bootstrap';

class ScoreList extends React.Component {

  createScoreListEntries() {

    var sorted = this.props.users.sort( (a, b) => {
      return b.score - a.score;
    });


    return sorted.map((user, index) => {
      return (
        <div>

          <li key={user.id} onClick={() => { this.props.selectUser(user); this.props.showModal({visibility: true, user: user}); } }>

            <div id="items" className="col-sm-6-offset-3">
            <div id="scoreList" className="col-sm-8">
              <img id="userImage" src={user.image} height="45" width="45"/>
                {user.username}
              </div>

              <div id="score">{user.score}<br></br></div>
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
<<<<<<< HEAD
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
                <div id="scr" className="col-sm-2">highdcores: {this.props.showScoreModal.user.score}</div>

=======
              <Modal.Body>
                <img src={this.props.showScoreModal.user.image} opacity=".9" height="200" width="200"/>
                     RANKING:   ROCKSTAR
                <br></br>
                USER STATS:
                <br></br>
                HIGH SCORE:
                <br></br>
                {this.props.showScoreModal.user.score}
>>>>>>> 9ab050bc9825022919f9e8622473c07969cc1e45
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
    users: state.users,
    showScoreModal: state.showScoreModal
  };
};

var mapDispatchToProps = (dispatch) => {
  return bindActionCreators({selectUser: selectUser, showModal: showModal, closeModal: closeModal}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScoreList);


<<<<<<< HEAD

                // <img src={this.props.showScoreModal.user.image} height="200" width="200"/>
                //      RANKING:   ROCKSTAR

                // USER STATS:

                // <br></br>
                // HIGH SCORE:
                // <br></br>
                // {this.props.showScoreModal.user.score}
=======
            // <div id="scoresList" className="col-sm-4-offset-4"><br></br>
            //   <div>
            //     <img src={user.image} height="55" width="55"/>
            //     {user.username}
            //   </div>

            //     <div className="col-sm-2">
            //       <div id="score">{user.score}</div>
            //     </div>

            // </div>
>>>>>>> 9ab050bc9825022919f9e8622473c07969cc1e45
