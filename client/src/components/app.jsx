import React from 'react';
import ReactDOM from 'react-dom';
import Example from '../containers/test.jsx';
import Home from '../containers/home.jsx';
import Settings from '../containers/settings.jsx';
import MusicSettings from '../containers/musicSettings.jsx';
import Game from '../containers/game.jsx';
import MultiPlayer from '../containers/multiPlayer.jsx';
import Score from '../containers/score.jsx';
import {Link, IndexRoute, browserHistory, DefaultRoute} from 'react-router';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Button} from 'react-bootstrap';


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Router history={browserHistory}>
          <div>
            <Route exact path='/' component={Settings} />
            <Route path='/multiPlayer' component={MultiPlayer} />
            <Route path='/musicSettings' component={MusicSettings} />
            <Route path='/game' component={Game} />
            <Route path='/score' component={Score} />
          </div>
        </Router>
        <Example/>
      </div>
    );
  }
}

export default App;
