import React from 'react';
import ReactDOM from 'react-dom';
import keyboardJS from 'keyboardjs';
import patterns from './patterns.jsx';
import { Redirect, Link } from 'react-router-dom';
import {Button} from 'react-bootstrap';
import ReactAudioPlayer from 'react-audio-player';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {changeSong, saveGame, getGame} from '../actions/index';
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
      attemptPressesP2: 0,
      songBlob: this.props.game.songBlob,
      exclamationP1: null,
      exclamationChangeP1: false,
      exclamationP2: null,
      exclamationChangeP2: false,
      gifFrame: 0
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

  startGlow() {
    var state = document.getElementById('canvas');
    state.className = 'multiCanvasBorderStart';
  }

  setGame() {
    var audio = ReactDOM.findDOMNode(this.refs.audio);
    if (this.state.game === true) {
      if (this.state.ongoing === false) {
        this.updateCanvas();
        this.startGlow();
        this.setState({ongoing: true});
      }
    }
  }

  startSong() {
    this.setState({
      game: true
    },
    this.setGame
    );
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
            // ctx.beginPath();
            // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            // ctx.closePath();
            // ctx.fillStyle = this.color;
            // ctx.fill();
            var img = new Image();
            img.src = 'assets/dots/shiny.png';
            var heightContext = 1 + Math.floor(context.state.gifFrame / 75);
            var widthContext = context.state.gifFrame % 75;
            ctx.drawImage(img, (img.width / 75) * widthContext, (heightContext - 1) * img.height / 2, img.width / 75, (img.height / 2), this.x, this.y, 50, 50);
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
          displacement = 600;
        } else if (player === 1) {
          displacement = 20;
        }
        for (let i = 0; i < rowArr.length; i ++) {
          if (rowArr[i].position === 1) {
            row.balls.push(makeBall(i * 100 + displacement, 200, color, rowArr[i].keyCode));
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

      var exclamationCounterP1 = 1;
      var exclamationCounterP2 = 1;

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
          ctx.font = '30px Iceland';
          ctx.fillText('ScoreP1: ' + context.state.scoreP1, 15, 50);
          ctx.fillText('ComboP1: ' + context.state.comboP1, 200, 50);
          ctx.fillText('scoreP2: ' + context.state.scoreP2, 575, 50);
          ctx.fillText('ComboP2: ' + context.state.comboP2, 770, 50);

// HEALTH INDICATOR
          ctx.fillStyle = 'white';
          ctx.fillRect(10, 57, 404, 31);
          ctx.fillRect(576, 57, 408, 31);
          ctx.fillStyle = 'black';
          ctx.fillRect(10, 58, 402, 29);
          ctx.fillRect(578, 58, 404, 29);

          var healthGradientBack = ctx.createLinearGradient(150, 0, 300, 0);
          healthGradientBack.addColorStop(0, 'red');
          healthGradientBack.addColorStop(1, 'yellow');
          ctx.fillStyle = healthGradientBack;
          ctx.fillRect(10, 60, 400, 25);

          var healthGradientBack2 = ctx.createLinearGradient(580, 0, 1000, 0);
          healthGradientBack2.addColorStop(0, 'red');
          healthGradientBack2.addColorStop(1, 'yellow');
          ctx.fillStyle = healthGradientBack2;
          ctx.fillRect(580, 60, 400, 25);

          var healthGradient = ctx.createLinearGradient(0, 0, 250, 0);
          healthGradient.addColorStop(0, 'blue');
          healthGradient.addColorStop(1, 'green');
          ctx.fillStyle = healthGradient;
          if (context.state.healthP1 > 0) {
            ctx.fillRect(10, 60, context.state.healthP1 * 4, 25);
          }

          var healthGradient2 = ctx.createLinearGradient(580, 0, 850, 0);
          healthGradient2.addColorStop(0, 'blue');
          healthGradient2.addColorStop(1, 'green');
          ctx.fillStyle = healthGradient2;
          if (context.state.healthP2 > 0) {
            ctx.fillRect(580, 60, context.state.healthP2 * 4, 25);
          }
// EXCLAMATIONS
          if (context.state.exclamationP1 !== null) {
            if (context.state.exclamationChangeP1 === true) {
              exclamationCounterP1 = 1;
              context.setState({exclamationChangeP1: false});
            }
            ctx.fillStyle = 'rgba(255, 255, 255,' + exclamationCounterP1 + ')';
            ctx.font = '40px Iceland';
            ctx.fillText(`${context.state.exclamationP1}`, 50, 150);
            exclamationCounterP1 -= .05;
            if (exclamationCounterP1 <= 0) {
              context.setState({exclamationP1: null});
              exclamationCounterP1 = 1;
            }
          }

          if (context.state.exclamationP2 !== null) {
            if (context.state.exclamationChangeP2 === true) {
              exclamationCounterP2 = 1;
              context.setState({exclamationChangeP2: false});
            }
            ctx.fillStyle = 'rgba(255, 255, 255,' + exclamationCounterP2 + ')';
            ctx.fillText(`${context.state.exclamationP2}`, 800, 150);
            exclamationCounterP2 -= .05;
            if (exclamationCounterP2 <= 0) {
              context.setState({exclamationP2: null});
              exclamationCounterP2 = 1;
            }
          }
// P1 BORDER
          //ctx.fillStyle = 'rgb(' + (255 - context.state.healthP1 * 2) + ',' + ( Math.floor(context.state.healthP1 * 2.5)) + ',' + (Math.floor( context.state.healthP1 * 2.5)) + ')';

          var borderTop = ctx.createLinearGradient(0, 0, 0, 10);
          borderTop.addColorStop(0, 'white');
          borderTop.addColorStop(1, 'rgb(' + (255 - context.state.healthP1 * 2) + ',' + ( Math.floor(context.state.healthP1 * 2.5)) + ',' + (Math.floor( context.state.healthP1 * 2.5)) + ')');
          ctx.fillStyle = borderTop;
          ctx.fillRect(0, 0, canvas.width / 2, 10);

          var borderLeft = ctx.createLinearGradient(0, 0, 10, 0);
          borderLeft.addColorStop(0, 'white');
          borderLeft.addColorStop(1, 'rgb(' + (255 - context.state.healthP1 * 2) + ',' + ( Math.floor(context.state.healthP1 * 2.5)) + ',' + (Math.floor( context.state.healthP1 * 2.5)) + ')');
          ctx.fillStyle = borderLeft;
          ctx.fillRect(0, 0, 10, canvas.height);

          var borderRight = ctx.createLinearGradient(0, canvas.height - 10, 0, canvas.height);
          borderRight.addColorStop(0, 'rgb(' + (255 - context.state.healthP1 * 2) + ',' + ( Math.floor(context.state.healthP1 * 2.5)) + ',' + (Math.floor( context.state.healthP1 * 2.5)) + ')');
          borderRight.addColorStop(1, 'white');
          ctx.fillStyle = borderRight;
          ctx.fillRect(0, canvas.height - 10, canvas.width / 2, 10);









//Player 2 Border
          // var borderTop = ctx.createLinearGradient(0, 0, 0, 10);
          // borderTop.addColorStop(0, 'white');
          // borderTop.addColorStop(1, 'rgb(' + (255 - context.state.health * 2) + ',' + ( Math.floor(context.state.health * 2.5)) + ',' + (Math.floor( context.state.health * 2.5)) + ')');
          // ctx.fillStyle = borderTop;
          // ctx.fillRect(0, 0, canvas.width, 10);
          //ctx.fillStyle = 'rgb(' + (255 - context.state.healthP2 * 2) + ',' + ( Math.floor(context.state.healthP2 * 2.5)) + ',' + (Math.floor( context.state.healthP2 * 2.5)) + ')';

          var borderTopP2 = ctx.createLinearGradient(0, 0, 0, 10);
          borderTopP2.addColorStop(0, 'white');
          borderTopP2.addColorStop(1, 'rgb(' + (255 - context.state.healthP2 * 2) + ',' + ( Math.floor(context.state.healthP2 * 2.5)) + ',' + (Math.floor( context.state.healthP2 * 2.5)) + ')');
          ctx.fillStyle = borderTopP2;
          ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, 10);


          //ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);

          var borderBot = ctx.createLinearGradient(canvas.width - 10, 0, canvas.width, 0);
          borderBot.addColorStop(1, 'white');
          borderBot.addColorStop(0, 'rgb(' + (255 - context.state.healthP2 * 2) + ',' + ( Math.floor(context.state.healthP2 * 2.5)) + ',' + (Math.floor( context.state.healthP2 * 2.5)) + ')');
          ctx.fillStyle = borderBot;

          ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);
          // ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, 10);

          var borderRight = ctx.createLinearGradient(0, canvas.height - 10, 0, canvas.height);
          borderRight.addColorStop(0, 'rgb(' + (255 - context.state.healthP2 * 2) + ',' + ( Math.floor(context.state.healthP2 * 2.5)) + ',' + (Math.floor( context.state.healthP2 * 2.5)) + ')');
          borderRight.addColorStop(1, 'white');
          ctx.fillStyle = borderRight;
          ctx.fillRect(canvas.width / 2, canvas.height - 10, canvas.width / 2, 10);
          ctx.fillStyle = 'white';







  /*                Player 1 Hit condition            */
  //         if (context.state.hitP1 === true) {
  //           if (counterP1 === 5) {
  //             context.setState({hitP1: false});
  //             counterP1 = 0;
  //           } else {
  //             ctx.fillStyle = 'blue';
  //             ctx.fillRect(50, 572.5, 400, 10);
  //             counterP1++;
  //             ctx.fillStyle = 'white';
  //           }
  //         } else {
  //           ctx.fillStyle = 'white';
  //           ctx.fillRect(50, 572.5, 400, 10);
  //         }

  // /*                Player 2 Hit condition            */
  //         if (context.state.hitP2 === true) {
  //           if (counterP2 === 5) {
  //             context.setState({hitP2: false});
  //             counterP2 = 0;
  //           } else {
  //             ctx.fillStyle = 'blue';
  //             ctx.fillRect(550, 575, 400, 10);
  //             counterP2++;
  //             ctx.fillStyle = 'white';
  //           }
  //         } else {
  //           ctx.fillStyle = 'white';
  //           ctx.fillRect(550, 572.5, 400, 10);
  //         }
          ctx.font = '30px Iceland';
          ctx.fillStyle = 'white';
          var img = new Image();
          img.src = 'assets/dots/crosshair.png';
          var frame = (context.state.gifFrame % 29);
          ctx.drawImage(img, (img.width / 30) * frame, 0, img.width / 30, img.height, 20, 552, 50, 50);

          ctx.fillText('A', 36, 585);
          ctx.drawImage(img, (img.width / 30) * frame, 0, img.width / 30, img.height, 120, 552, 50, 50);
          ctx.fillText('S', 136, 585);
          ctx.drawImage(img, (img.width / 30) * frame, 0, img.width / 30, img.height, 220, 552, 50, 50);
          ctx.fillText('D', 236, 585);
          ctx.drawImage(img, (img.width / 30) * frame, 0, img.width / 30, img.height, 320, 552, 50, 50);
          ctx.fillText('F', 336, 585);


          ctx.drawImage(img, (img.width / 30) * frame, 0, img.width / 30, img.height, 600, 552, 50, 50);
          ctx.fillText('J', 618, 585);
          ctx.drawImage(img, (img.width / 30) * frame, 0, img.width / 30, img.height, 700, 552, 50, 50);
          ctx.fillText('K', 718, 585);
          ctx.drawImage(img, (img.width / 30) * frame, 0, img.width / 30, img.height, 800, 552, 50, 50);
          ctx.fillText('L', 818, 585);
          ctx.drawImage(img, (img.width / 30) * frame, 0, img.width / 30, img.height, 900, 552, 50, 50);
          ctx.fillText(';', 920, 585);

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

          console.log('----> current user',context.props.currentUser);
           context.props.saveGame(context.props.currentUser.id, context.state);

          ctx.clearRect(-50, -50, 1500, 1500);
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, 1500, 800);
          ctx.fillStyle = 'white';
          ctx.font = '20px Iceland';
          ctx.fillText(' FINAL SCORE PLAYER 1: ' + context.state.scoreP1, 20, 50);
          ctx.fillText(' FINAL SCORE PLAYER 2: ' + context.state.scoreP2, 560, 50);
          ctx.font = '20px Iceland';
          ctx.fillText(' THANKS FOR PLAYING ', 400, 150);
          ctx.fillText(' The Lucky Lemons Dev Group ', 380, 350);
        }
      }

      audio.play();
      var drawLoop = setInterval(()=> {
        if (context.state.gifFrame < 149) {
          context.setState({gifFrame: this.state.gifFrame + 1});
        } else {
          context.setState({gifFrame: 1});
        }
        draw();
        if (context.state.healthP1 <= 0 && context.state.healthP2 <= 0 || context.state.end === true) {
          audio.pause();
          context.setState({end: true});
          clearInterval(frameCheck);
          clearInterval(drawLoop);
          draw();
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
///////////////// FRAME CHECK

      var frameCheck = setInterval(()=>{
        var patternType = Math.floor(Math.random() * 10);
        var formationP1 = makeRow(patternType, 1);
        var formationP2 = makeRow(patternType, 2);
        allRowsP1.rows.push(formationP1);
        allRowsP2.rows.push(formationP2);
        if (context.state.healthP1 <= 0 && context.state.healthP2 <= 0 || context.state.end === true) {
          clearInterval(drawLoop);
          clearInterval(frameCheck);
        }
      }, (60000 / (context.state.bpm * modifier)) );


      var checkMove = (arrayRow) => {
        var output = arrayRow.rows[0].balls.map(function(ball) {
          return (ball.keyBind);
        });
        output = [output.join('')];
        output.push(Math.abs(550 - arrayRow.rows[0].balls[0].y));
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
          if (moveCheck[moveCheck.length - 1] < 40) {
            if (moveCheck[0] === keyCodes) {
              if (player === 'playerOne') {
                if (moveCheck[moveCheck.length - 1] < 5) {
                  context.setState({exclamationP1: 'Pefect!', exclamationChangeP1: true} );
                } else if (moveCheck[moveCheck.length - 1] < 20) {
                  context.setState({exclamationP1: 'Great!', exclamationChangeP1: true });
                } else if (moveCheck[moveCheck.length - 1] < 30) {
                  context.setState({exclamationP1: 'Good!', exclamationChangeP1: true });
                } else {
                  context.setState({exclamationP1: 'Nice try buddy!', exclamationChangeP1: true});
                }
                context.increaseScoreP1();
                context.setState({comboP1: context.state.comboP1 + 1});
                allRowsP1.rows.shift();
              } else {
                if (moveCheck[moveCheck.length - 1] < 5) {
                  context.setState({exclamationP2: 'Pefect!', exclamationChangeP2: true} );
                } else if (moveCheck[moveCheck.length - 1] < 20) {
                  context.setState({exclamationP2: 'Great!', exclamationChangeP2: true });
                } else if (moveCheck[moveCheck.length - 1] < 30) {
                  context.setState({exclamationP2: 'Good!', exclamationChangeP2: true });
                } else {
                  context.setState({exclamationP2: 'Nice try buddy!', exclamationChangeP2: true});
                }
                context.increaseScoreP2();
                context.setState({comboP2: context.state.comboP2 + 1});
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
    if (this.state.songBlob !== null) {
      var songBlob = this.state.songBlob;
    } else {
      var songBlob = `assets/music/${this.state.song}`;
    }

    var start = function() {
      console.log('click');
      startSong();
      if (!!window.background) {
        window.background.pause();
      }
    };
    return (
      <div className= 'multiplayer text-center'>
        <div>
          <canvas ref="canvas" id='canvas' width={1000} height={625}/>
        </div>
              <ReactAudioPlayer
                src={`${songBlob}`}
                autoPlay={false}
                controls={false}
                ref="audio"
                onEnded={function() { boundEnd(); } }
              />
                {
                  this.state.ongoing === false &&
                  <div className="startChoiceBtn" onClick={start}>
                   <h3>Start Song</h3>
                  </div>
                }
                {
                  this.state.end === true &&
                  <Link to='/score'><Button className="startChoiceBtn" >
                    <h3>Highscore</h3>
                  </Button></Link>
                }
      </div>
    );
  }
}
var mapStateToProps = (state) => {
  return {
    game: state.game,
    currentUser: state.currentUser
  };
};

var matchDispatchToProps = (dispatch) => {
  return bindActionCreators({getGame: getGame, changeSong: changeSong, saveGame: saveGame}, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Multiplayer);

