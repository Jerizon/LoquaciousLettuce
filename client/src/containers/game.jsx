 import React from 'react';
 import ReactDOM from 'react-dom';
 import keyboardJS from 'keyboardjs';
 import patterns from './patterns.jsx';
 import { Redirect, Link } from 'react-router-dom';
 import ReactAudioPlayer from 'react-audio-player';
 import {Button, ButtonGroup, Navbar, FormGroup, FormControl, Tabs, Tab} from 'react-bootstrap';
 import {connect} from 'react-redux';
 import {bindActionCreators} from 'redux';
 import {changeSong, getGame} from '../actions/index';

 class Game extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       score: 0,
       hit: false,
       game: false,
       health: 100,
       hits: 0,
       combo: 0,
       ongoing: false,
       end: false,
       song: this.props.game.song,
       bpm: this.props.game.bpm,
       difficulty: this.props.game.difficulty,
       player: this.props.game.difficulty,
       attemptPresses: 0
     };
     this.updateCanvas = this.updateCanvas.bind(this);

     this.increaseScore = this.increaseScore.bind(this);

     this.increaseAttempt = this.increaseAttempt.bind(this);
     this.decreaseAttempt = this.decreaseAttempt.bind(this);
   }

   componentDidMount() {
     console.log('THIS IS THE GAME', this.props.game);
   }

   increaseScore() {
     this.setState({score: this.state.score + 10 + this.state.combo, hit: true, hits: this.state.hits + 1});
     if (this.state.health < 100) {
       this.setState({health: this.state.health + 1 + this.state.combo});
     }
     console.log(this.state);
   }

   increaseAttempt() {
     this.setState({attemptPresses: this.state.attemptPresses + 1});
    //console.log(this.state.attemptPresses);
   }
   decreaseAttempt() {
     this.setState({attemptPresses: this.state.attemptPresses - 1});
    //console.log(this.state.attemptPresses);
   }

   startSong() {
     this.setState({game: true});
    //console.log(this.state.game);
     var audio = ReactDOM.findDOMNode(this.refs.audio);
     if (this.state.game === true) {
       if (this.state.ongoing === false) {
         this.updateCanvas();
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

       var makeBall = function (xCor, yCor, color, keyBind) {
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

       var makeRow = function(hexCode) {
         var rowArr = [0, 0, 0, 0, ];
         var corArr = ['a', 's', 'd', 'f'];
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
         for (let i = 0; i < rowArr.length; i ++) {
           if (rowArr[i].position === 1) {
             row.balls.push(makeBall(i * 100 + 50, 100, color, rowArr[i].keyCode));
           }
         }
         return row;
       };

       var allRows = {
         rows: [],

         flashDots: function() {
           if (this.rows[0]) {
             if (this.rows[0].balls) {
               if (this.rows[0].balls) {
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
         },

         checkDelete: function() {
           for (let i = 0; i < this.rows.length; i++) {
             if (this.rows[0]) {
               if (this.rows[0].balls) {
                 if (this.rows[0].balls) {
                   if (this.rows[0].balls.length === 0 || this.rows[0].balls[0].y > 580) {
                     context.setState({ combo: 0, health: context.state.health - 5});
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

       var counter = 0;
       function draw() {

         analyser.getByteFrequencyData(frequencyData);
        //console.log(frequencyData);

         if (context.state.end === false) {
           ctx.clearRect(0, 0, canvas.width, canvas.height);
           ctx.fillStyle = 'black';
           ctx.fillRect(5, 5, 400, 600);
// BACKGROUND FOR AUDIO ANALYTICS
           var barWidth = (400 / bufferLength);
           var barHeight;
           var x = 5;
           for (var i = 0; i < bufferLength; i++) {
             barHeight = frequencyData[i];
             ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,255)';
             ctx.fillRect(x, 600 - 2 * barHeight, barWidth, 2 * barHeight);
             x += barWidth;
           }
// ACTUAL GAME GAME STUFF
           ctx.fillStyle = 'white';
           ctx.font = '40px Arial';
           ctx.fillText('Score: ' + context.state.score, 10, 50);
// HEALTH INDICATOR
           ctx.fillRect(10, 60, context.state.health * 4, 25);
//
           if (context.state.hit === true) {
             if (counter === 5) {
               context.setState({hit: false});
               counter = 0;
             } else {
               ctx.fillStyle = 'blue';
               ctx.fillRect(0, 575, 400, 10);
               counter++;
               ctx.fillStyle = 'white';
             }

           } else {
             ctx.fillStyle = 'white';
             ctx.fillRect(0, 572.5, 400, 10);
           }
// BORDER
           ctx.fillStyle = 'rgb(' + (255 - context.state.health * 2) + ',' + ( Math.floor(context.state.health * 2.5)) + ',' + (Math.floor( context.state.health * 2.5)) + ')';
           ctx.fillRect(0, 0, canvas.width, 10);
           ctx.fillRect(0, 0, 10, canvas.height);
           ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);
           ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
           ctx.fillStyle = 'white';

           allRows.rows.forEach(function(row) {
             row.drawRow();
             row.advanceRow();
           });
           allRows.checkDelete();
           allRows.flashDots();

         } else {
           ctx.clearRect(-50, -50, 1500, 1500);
           ctx.fillStyle = 'black';
           ctx.fillRect(5, 5, 400, 600);
           ctx.fillStyle = 'white';
           ctx.fillText(' FINAL SCORE: ' + context.state.score, 20, 50);
           ctx.font = '20px Arial';
           ctx.fillText(' THANKS FOR PLAYING ', 30, 150);
           ctx.fillText(' The Lucky Lemons Dev Group ', 40, 350);
         }


       }
       setTimeout(function() {
         audio.play();
       }, (475 / (4 * (1000 / 30))) * 1000);
       setInterval(()=> {
         draw();
         if (context.state.health <= 0) {
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
         allRows.rows.push(makeRow(Math.floor(Math.random() * 10)));
       }, Math.floor(60000 / (context.state.bpm * modifier)) );


       var checkMove = () => {
         var output = allRows.rows[0].balls.map(function(ball) {
           return (ball.keyBind);
         });
         output = [output.join('')];
         output.push(Math.abs(575 - allRows.rows[0].balls[0].y));
         return output;
       };

       function ListenEvents() {
         var validMove = (keyCodes) =>{
           context.increaseAttempt();
           var moveCheck = checkMove();
           if (keyCodes.length === 2) {
             context.decreaseAttempt();
           }
           if (moveCheck[moveCheck.length - 1] < 35) {
             if (moveCheck[0] === keyCodes) {
               context.increaseScore();
               allRows.rows.shift();
               context.setState({combo: context.state.combo + 1});
             }
           }
         };

         function listenToA() {
           keyboardJS.bind('a', function(e) {
             validMove('a');
           });
         }
         listenToA();

         function listenToS() {
           keyboardJS.bind('s', function(e) {
             validMove('s');
           });
         }
         listenToS();

         function listenToD() {
           keyboardJS.bind('d', function(e) {
             validMove('d');
           });
         }
         listenToD();

         function listenToF() {
           keyboardJS.bind('f', function(e) {
             validMove('f');
           });
         }
         listenToF();

         function listenToAS() {
           keyboardJS.bind('a + s', function(e) {
             validMove('as');
           });
         }
         listenToAS();

         function listenToAD() {
           keyboardJS.bind('a + d', function(e) {
             validMove('ad');
           });
         }
         listenToAD();

         function listenToAF() {
           keyboardJS.bind('a + f', function(e) {
             validMove('af');
           });
         }
         listenToAF();

         function listenToSD() {
           keyboardJS.bind('s + d', function(e) {
             validMove('sd');
           });
         }
         listenToSD();

         function listenToSF() {
           keyboardJS.bind('s + f', function(e) {
             validMove('sf');
           });
         }
         listenToSF();

         function listenToDF() {
           keyboardJS.bind('d + f', function(e) {
             validMove('df');
           });
         }
         listenToDF();
       }
       function listenToJEY() {
         keyboardJS.bind('j + e + y', function(e) {
           //context.setState({score: context.state.score + 999});
         });
       }
       listenToJEY();

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
     return (
      <div className= 'text-center'>
        <div>
          <canvas ref="canvas" width={400} height={625}/>
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
                <Button className="btn btn-primary btn-sx" ><Link to='/score'>High Scores</Link></Button>
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

 export default connect(mapStateToProps, matchDispatchToProps)(Game);