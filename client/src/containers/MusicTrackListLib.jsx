import React from 'react';
import {connect} from 'react-redux';
import MusicTrackEntryLib from './MusicTrackEntryLib.jsx';
import {bindActionCreators} from 'redux';
import {changeSong, getBPM} from '../actions/index';

class MusicTrackListLib extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.chooseSong = this.chooseSong.bind(this);
  }


  chooseSong(item) {
    console.log('clicked', item);
    this.props.changeSong(item.mp3);
    this.props.getBPM(item.bpm);
  }

  render() {
    return (
      <div className = 'MusicTrack' style={{height: 400, overflow: 'scroll'}}>
          {
            this.props.library.example.tracks.items.map((item, index) => (
              <MusicTrackEntryLib
                choose = {this.chooseSong}
                item = {item}
                key = {index}
              />
            ))
          }
      </div>
    );
  }
}

var mapStateToProps = (state) => {
  return {
    library: state.library
  };
};

var matchDispatchToProps = (dispatch) => {
  return bindActionCreators({changeSong: changeSong, getBPM: getBPM}, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(MusicTrackListLib);
