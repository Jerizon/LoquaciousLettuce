import React from 'react';
import ReactDOM from 'react-dom';
import keyboardJS from 'keyboardjs';
import patterns from './patterns.jsx';
import { Redirect, Link } from 'react-router-dom';
import {Button} from 'react-bootstrap';
import ReactAudioPlayer from 'react-audio-player';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeSong, getGame} from '../actions/index';
import visuals from '../visualizations/songVisuals.js';

class Multiplayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scoreP1: 0,
      scoreP2: 0,
      comboP1: 0,
      comboP2: 0,
      hitP1: false,
      hitP2: false,
      healthP1: 100,
      healthP2: 100,
      hitsP1: 0,
      hitsP2: 0,
      game: false,
      ongoing: false,
      end: false,
      song: this.props.game.song,
      bpm: this.props.game.bpm,
      difficulty: this.props.game.difficulty,
      //player: this.props.game.difficulty,
      attemptPressesP1: 0,
      attemptPressesP2: 0
    };
    this.updateCanvas = this.updateCanvas.bind(this);

    this.increaseScoreP1 = this.increasescoreP1.bind(this);
    this.increaseScoreP2 = this.increasescoreP2.bind(this);

    this.increaseAttemptP1 = this.increaseAttemptP1.bind(this);
    this.increaseAttemptP2 = this.increaseAttemptP2.bind(this);

    this.decreaseAttemptP1 = this.decreaseAttemptP1.bind(this);
    this.decreaseAttemptP2 = this.decreaseAttemptP2.bind(this);
  }

  componentDidMount() {
    console.log('THIS IS THE GAME', this.props.game, this.state);
  }

  increasescoreP1() {
    this.setState({scoreP1: this.state.scoreP1 + 10 + this.state.comboP1, hitP1: true});
    if (this.state.healthP1 < 100) {
      this.setState({healthP1: this.state.healthP1 + 1 + this.state.comboP1});
    }
  }
  increasescoreP2() {
    this.setState({scoreP2: this.state.scoreP2 + 10 + this.state.comboP2, hitP2: true});
    if (this.state.healthP2 < 100) {
      this.setState({healthP2: this.state.healthP2 + 1 + this.state.comboP2});
    }
  }


  increaseAttemptP1() {
    this.setState({attemptPressesP1: this.state.attemptPressesP1 + 1});
  }
  increaseAttemptP2() {
    this.setState({attemptPressesP2: this.state.attemptPressesP2 + 1});
  }


  decreaseAttemptP1() {
    this.setState({attemptPressesP1: this.state.attemptPressesP1 - 1});
  }
  decreaseAttemptP2() {
    this.setState({attemptPressesP1: this.state.attemptPressesP1 - 1});
  }

  startSong() {
    var audio = ReactDOM.findDOMNode(this.refs.audio);
    this.setState({game: true});
    if (this.state.game === true) {
      if (this.state.ongoing === false) {
        this.updateCanvas();
        // setTimeout(function() {
        //   audio.play();
          // }, (475 / (4 * (1000 / 30))) * 1000);
        this.setState({ongoing: true});
      }
    }
  }

  updateCanvas() {
    if (this.state.game === true) {
      var canvas = this.refs.canvas;
      var ctx = this.refs.canvas.getContext('2d');
      var context = this;
      ListenEvents();

      var makeBall = function (xCor, yCor, color, keyBind, player) {
        var ball = {
          x: xCor,
          y: yCor,
          vx: 0,
          vy: 4,
          radius: 10,
          color: color,
          keyBind: keyBind,
          draw: function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
          }
        };
        return ball;
      };

      var makeRow = function(hexCode, player) {
        var rowArr = [0, 0, 0, 0, ];
        var corArr = [[], ['a', 's', 'd', 'f'], ['j', 'k', 'l', ';']][player];
        for (let i = 0; i < 4; i++) {
          if (patterns[hexCode][i] === 1) {
            rowArr[i] = {
              position: 1,
              keyCode: corArr[i]
            };
          }
        }

        let row = {
          balls: [],
          drawRow: function () {
            row.balls.forEach(function(ball) {
              ball.draw();
            });
          },
          advanceRow: function () {
            row.balls.forEach(function(ball) {
              ball.y += ball.vy;
            });
          },
        };
        var color = '#' + Math.random().toString(16).substr(-6);
        var displacement = 0;
        if (player === 2) {
          displacement = 515;
        } else if (player === 1) {
          displacement = 0;
        }
        for (let i = 0; i < rowArr.length; i ++) {
          if (rowArr[i].position === 1) {
            row.balls.push(makeBall(i * 80 + 125 + displacement, 200, color, rowArr[i].keyCode));
          }
        }
        return row;
      };

      var allRowsP1 = {
        rows: [],

        flashDots: function() {
          if (this.rows[0]) {
            if (this.rows[0].balls) {
              if (this.rows[0].balls) {
                if (this.rows[0].balls[0]) {
                  if (this.rows[0].balls[0].y > 540 && this.rows[0].balls[0].y < 560) {
                    this.rows[0].balls.forEach(function(ball) {
                      ball.color = 'white';
                    });
                  } else if (this.rows[0].balls[0].y > 575) {
                    this.rows[0].balls.forEach(function(ball) {
                      ball.color = 'red';
                    });
                  }
                }
              }
            }
          }
        },

        checkDelete: function() {
          for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[0]) {
              if (this.rows[0].balls) {
                if (this.rows[0].balls) {
                  if (this.rows[0].balls.length === 0 || this.rows[0].balls[0].y > 580) {
                    var ball = this.rows[0].balls[0];
                    if (ball.keyBind === 'a' || ball.keyBind === 's' || ball.keyBind === 'd' || ball.keyBind === 'f') {
                      context.setState({ comboP1: 0, healthP1: context.state.healthP1 - 5});
                    } else if (ball.keyBind === 'j' || ball.keyBind === 'k' || ball.keyBind === 'l' || ball.keyBind === ';') {
                      context.setState({ comboP2: 0, healthP2: context.state.healthP2 - 5});
                    }

                    this.rows.shift();
                  }
                }
              }
            }
          }
        }
      };



      var audioCtx = new AudioContext();
      var audio = ReactDOM.findDOMNode(this.refs.audio);
      var audioSrc = audioCtx.createMediaElementSource(audio);
      var analyser = audioCtx.createAnalyser();

      audioSrc.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 256;
      var bufferLength = analyser.frequencyBinCount;
      var frequencyData = new Uint8Array(bufferLength);

      var allRowsP2 = Object.assign({}, allRowsP1, {rows: []});
      var counterP1 = 0;
      var counterP2 = 0;

      function draw() {

        if (context.state.end === false) {
          var upperX = 5;
          var upperY = 5;
          var lowerX = 1000;
          var lowerY = 600;
          analyser.getByteFrequencyData(frequencyData);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'black';
          ctx.fillRect(upperX, upperY, lowerX, lowerY);

// BACKGROUND FOR AUDIO ANALYTICS
          visuals[1](upperX, upperY, lowerX, lowerY, frequencyData, ctx, bufferLength);
          
// ACTUAL GAME GAME STUFF

          ctx.fillStyle = 'white';
          ctx.font = '40px Arial';
          ctx.fillText('scoreP1: ' + context.state.scoreP1, 50, 50);
          ctx.fillText('scoreP2: ' + context.state.scoreP2, 575, 50);
// HEALTH INDICATOR
          if (context.state.healthP1 > 0) {
            ctx.fillRect(10, 60, context.state.healthP1 * 4, 25);
          }
          if (context.state.healthP2 > 0) {
            ctx.fillRect(580, 60, context.state.healthP2 * 4, 25);
          }

// BORDER
          ctx.fillStyle = 'rgb(' + (255 - context.state.healthP1 * 2) + ',' + ( Math.floor(context.state.healthP1 * 2.5)) + ',' + (Math.floor( context.state.healthP1 * 2.5)) + ')';          
          ctx.fillRect(0, 0, canvas.width / 2, 10);
          ctx.fillRect(0, 0, 10, canvas.height);
          ctx.fillRect(0, canvas.height - 10, canvas.width / 2, 10);
          ctx.fillStyle = 'rgb(' + (255 - context.state.healthP2 * 2) + ',' + ( Math.floor(context.state.healthP2 * 2.5)) + ',' + (Math.floor( context.state.healthP2 * 2.5)) + ')';
          ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);
          ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, 10);
          ctx.fillRect(canvas.width / 2, canvas.height - 10, canvas.width / 2, 10);
          ctx.fillStyle = 'white';
  /*                Player 1 Hit condition            */
          if (context.state.hitP1 === true) {
            if (counterP1 === 5) {
              context.setState({hitP1: false});
              counterP1 = 0;
            } else {
              ctx.fillStyle = 'blue';
              ctx.fillRect(50, 572.5, 400, 10);
              counterP1++;
              ctx.fillStyle = 'white';
            }
          } else {
            ctx.fillStyle = 'white';
            ctx.fillRect(50, 572.5, 400, 10);
          }

  /*                Player 2 Hit condition            */
          if (context.state.hitP2 === true) {
            if (counterP2 === 5) {
              context.setState({hitP2: false});
              counterP2 = 0;
            } else {
              ctx.fillStyle = 'blue';
              ctx.fillRect(550, 575, 400, 10);
              counterP2++;
              ctx.fillStyle = 'white';
            }
          } else {
            ctx.fillStyle = 'white';
            ctx.fillRect(550, 572.5, 400, 10);
          }

  /*                Player 1 Dot Advance           */
          allRowsP1.rows.forEach(function(row) {
            row.drawRow();
            row.advanceRow();
          });
          allRowsP1.checkDelete();
          allRowsP1.flashDots();

  /*                Player 2 Dot Advance            */
          allRowsP2.rows.forEach(function(row) {
            row.drawRow();
            row.advanceRow();
          });
          allRowsP2.checkDelete();
          allRowsP2.flashDots();
          
        } else {

          ctx.clearRect(-50, -50, 1500, 1500);
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, 1500, 800);
          ctx.fillStyle = 'white';
          ctx.fillText(' FINAL SCORE PLAYER 1: ' + context.state.scoreP1, 20, 50);
          ctx.fillText(' FINAL SCORE PLAYER 2: ' + context.state.scoreP2, 600, 50);
          ctx.font = '20px Arial';
          ctx.fillText(' THANKS FOR PLAYING ', 400, 150);
          ctx.fillText(' The Lucky Lemons Dev Group ', 380, 350);
        }
      }

      setTimeout(function() {
        audio.play();
      }, (375 / (4 * (1000 / 30))) * 1000);

      setInterval(()=> {
        draw();
        if (context.state.healthP1 <= 0 && context.state.healthP2 <= 0) {
           audio.pause();
           context.setState({end: true});
         }
      }, 1000 / 30);

      var modifier = 1;
      if (context.state.difficulty === 'super_beginner') {
        modifier = .25;
      } else if (context.state.difficulty === 'beginner') {
        modifier = .5;
      } else if (context.state.difficulty === 'intermediate') {
        modifier = 1;
      } else if (context.state.difficulty === 'advanced') {
        modifier = 2;
      } else if (context.state.difficulty === 'rockstar') {
        modifier = 4;
      }

      setInterval(()=>{
        var patternType = Math.floor(Math.random() * 10);
        var formationP1 = makeRow(patternType, 1);
        var formationP2 = makeRow(patternType, 2);
        allRowsP1.rows.push(formationP1);
        allRowsP2.rows.push(formationP2);
      }, (60000 / (context.state.bpm * modifier)) );


      var checkMove = (arrayRow) => {
        var output = arrayRow.rows[0].balls.map(function(ball) {
          return (ball.keyBind);
        });
        output = [output.join('')];
        output.push(Math.abs(575 - arrayRow.rows[0].balls[0].y));
        return output;
      };

      function ListenEvents() {
        var validMove = (keyCodes, arrayRow, player) =>{
          var moveCheck = checkMove(arrayRow);
          if (player === 'playerOne') {
            context.increaseAttemptP1();
          } else {
            context.increaseAttemptP2();
          }
          if (keyCodes.length === 2) {
            if (player === 'playerOne') {
              context.decreaseAttemptP1();
            } else {
              context.decreaseAttemptP2();
            }
          }
          if (moveCheck[moveCheck.length - 1] < 35) {
            if (moveCheck[0] === keyCodes) {
              if (player === 'playerOne') {
                context.increaseScoreP1();
                context.setState({comboP1: context.state.comboP1 + 1});
                allRowsP1.rows.shift();
              } else {
                context.increaseScoreP2();
                context.setState({comboP2: context.state.comboP2 + 2});
                allRowsP2.rows.shift();
              }
              ctx.fillStyle = 'black';
              ctx.fillRect(0, 575, 400, 5);
            }
          }
        };

        function listenToA() {
          keyboardJS.bind('a', function(e) {
            validMove('a', allRowsP1, 'playerOne');
          });
        }
        listenToA();

        function listenToS() {
          keyboardJS.bind('s', function(e) {
            validMove('s', allRowsP1, 'playerOne');
          });
        }
        listenToS();

        function listenToD() {
          keyboardJS.bind('d', function(e) {
            validMove('d', allRowsP1, 'playerOne');
          });
        }
        listenToD();

        function listenToF() {
          keyboardJS.bind('f', function(e) {
            validMove('f', allRowsP1, 'playerOne');
          });
        }
        listenToF();

        function listenToAS() {
          keyboardJS.bind('a + s', function(e) {
            validMove('as', allRowsP1, 'playerOne');
          });
        }
        listenToAS();

        function listenToAD() {
          keyboardJS.bind('a + d', function(e) {
            validMove('ad', allRowsP1, 'playerOne');
          });
        }
        listenToAD();

        function listenToAF() {
          keyboardJS.bind('a + f', function(e) {
            validMove('af', allRowsP1, 'playerOne');
          });
        }
        listenToAF();

        function listenToSD() {
          keyboardJS.bind('s + d', function(e) {
            validMove('sd', allRowsP1, 'playerOne');
          });
        }
        listenToSD();

        function listenToSF() {
          keyboardJS.bind('s + f', function(e) {
            validMove('sf', allRowsP1, 'playerOne');
          });
        }
        listenToSF();

        function listenToDF() {
          keyboardJS.bind('d + f', function(e) {
            validMove('df', allRowsP1, 'playerOne');
          });
        }
        listenToDF();

  /*              Player 2 Key Binds                */
        function listenToJ() {
          keyboardJS.bind('j', function(e) {
            validMove('j', allRowsP2, 'playerTwo');
          });
        }
        listenToJ();

        function listenToK() {
          keyboardJS.bind('k', function(e) {
            validMove('k', allRowsP2, 'playerTwo');
          });
        }
        listenToK();

        function listenToL() {
          keyboardJS.bind('l', function(e) {
            validMove('l', allRowsP2, 'playerTwo');
          });
        }
        listenToL();

        function listenToSemiColon() {
          keyboardJS.bind(';', function(e) {
            validMove(';', allRowsP2, 'playerTwo');
          });
        }
        listenToSemiColon();

        function listenToJK() {
          keyboardJS.bind('j + k', function(e) {
            validMove('jk', allRowsP2, 'playerTwo');
          });
        }
        listenToJK();

        function listenToJL() {
          keyboardJS.bind('j + l', function(e) {
            validMove('jl', allRowsP2, 'playerTwo');
          });
        }
        listenToJL();

        function listenToJSemiColon() {
          keyboardJS.bind('j + ;', function(e) {
            validMove('j;', allRowsP2, 'playerTwo');
          });
        }
        listenToJSemiColon();

        function listenToKL() {
          keyboardJS.bind('k + l', function(e) {
            validMove('kl', allRowsP2, 'playerTwo');
          });
        }
        listenToKL();

        function listenToKSemiColon() {
          keyboardJS.bind('k + ;', function(e) {
            validMove('k;', allRowsP2, 'playerTwo');
          });
        }
        listenToKSemiColon();

        function listenToLSemiColon() {
          keyboardJS.bind('l + ;', function(e) {
            validMove('l;', allRowsP2, 'playerTwo');
          });
        }
        listenToLSemiColon();
      }
    }
  }

  trackEnd() {
    console.log('The song has ended');
    this.setState({end: true});
  }

  render() {
    var boundEnd = this.trackEnd.bind(this);
    var startSong = this.startSong.bind(this);
    var song = this.state.song;
    console.log('OBJECT', this.state);
    return (
      <div className= 'multiplayer text-center'>
        <div>
          <canvas ref="canvas" width={1000} height={625}/>
        </div>
              <ReactAudioPlayer
                src={`assets/music/${song}`}
                autoPlay={false}
                controls={false}
                ref="audio"
                onEnded={function() { boundEnd(); } }
              />
              {
                this.state.ongoing === false &&
                <Button className="btn btn-primary btn-sx" onClick={function() { startSong(); } }> Start Song </Button>
              }
              {
                this.state.end === true &&
                <Button><Link to='/score'>Score</Link></Button>
              }
              
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
  return bindActionCreators({getGame: getGame, changeSong: changeSong}, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Multiplayer);

