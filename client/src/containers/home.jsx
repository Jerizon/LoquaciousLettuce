import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {Modal, Button, ButtonGroup, FieldGroup, Form, FormControl, FormGroup, ControlLabel, Col, Checkbox} from 'react-bootstrap';

class Home extends React.Component {
  render() {
    return (
      <div className='homePage'>
        IGNORE THIS HOMEPAGE FOR NOW - JULIA<br></br>
        <audio autoPlay>
          <source src = 'U2.mp3' type ='audio/wav'/>
        </audio>

        <div className="col-sm-2" style={{background:'black', height: 500}}></div>


          <div className="static-modal">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>TESSELL8</Modal.Title>
              </Modal.Header>




               <Modal.Footer>
               Sign in with Spotify<br></br>
                 <a style={{ marginRight: 270 }} href="/auth/spotify"><img style={{ width: 70 }} src="/assets/Spotify.png" /></a>
                 <br></br>
                <Link to='/settings'>Select Player Mode</Link>
              </Modal.Footer>



            </Modal.Dialog>
          </div>



        <br></br>

      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {
    homeView: state.homeView
  };
};

export default connect(mapStateToProps)(Home);

    // <Button>Close</Button>
    // <Button bsStyle="primary">Save changes</Button>


              //     <Modal.Body>
              //     {this.props.homeView === 'preSignUp' ?
              //       <div>
              //         <PreSignUp />
              //       </div>
              //     : this.props.homeView === 'signUp' ?
              //       <div>
              //         <SignUp />
              //       </div>
              //     : this.props.homeView === 'preLogin' ?
              //       <div>
              //         <PreLogin />
              //       </div>

              //     : this.props.homeView === 'login' ?
              //       <div>
              //         <Login />
              //       </div>
              //     : <div>
              //         No Home View Selected
              //       </div>}

              // </Modal.Body>
