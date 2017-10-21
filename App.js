import React from 'react';
import { StyleSheet, Text, View, Animated, Easing, Dimensions, Image} from 'react-native';

//get the assets
const side = require('./assets/side.png')
const car = require('./assets/car.png')
const car1 = require('./assets/car1.png')
const checkered = require('./assets/checkered.png')
  
const countdownDim = 80;
//get device's window dimensions for positioning 
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const carWidth = 89;
const carHeight = 189 

export default class App extends React.Component {

  constructor() { 
    super() 
  
    this.state = {
      //animation values for countdown
      countdownAnimationValues: {
        one: new Animated.ValueXY(0,0),
        two: new Animated.ValueXY(0,0),
        three: new Animated.ValueXY(0,0),
        goIn: new Animated.Value(0),
        goOpacity: new Animated.Value(0),
        goOut: new Animated.Value(0)
      }, 

      /** CHANGE TO LEFT LANE */
      /** CHANGE TO RIGHT LANE */ 
      carAnimationValues: {
        //rotate and translate needs to be separate
        //else react combines the transformation matrices
        rotateZ: new Animated.Value(0), //rotation when changing lanes
        moveX: new Animated.Value(0), //translation when changing lanes
        //movement for the extra cars
        extraMoveY: new Animated.Value(0),
        extra2MoveY: new Animated.Value(0)
      },

      /** SIDE TRACK ANIM */
     
      sidetrackAnimationValues: {
        running: new Animated.Value(0)
      },

      //animated values for the messages at the end
      endAnimValues: {
        message1: new Animated.Value(0),
        message2: new Animated.Value(0),
        message3: new Animated.Value(0)
      },

      //animated value for the finish line
      finishLineAnimValue: new Animated.Value(0) 
      
    } 
  
    //set countdown animations
    this.countdownAnim = {
      threeIn: Animated.timing(this.state.countdownAnimationValues.one, {
        toValue: {x: 0, y:1},
        duration: 1000,
        easing: Easing.quad       
      }),   
      threeOut: Animated.timing(this.state.countdownAnimationValues.one, {
        toValue: {x: 1, y: 1},
        duration: 1000,
        easing: Easing.quad
      }),
      twoIn: Animated.timing(this.state.countdownAnimationValues.two, {
        toValue: {x: 1, y: 0}, 
        duration: 1000,
        easing: Easing.quad
      }),
      twoOut: Animated.timing(this.state.countdownAnimationValues.two, {
        toValue: {x: 1, y:1},
        duration: 1000,
        easing: Easing.quad 
      }),
      oneIn: Animated.timing(this.state.countdownAnimationValues.three, {
        toValue: {x: 0, y:1}, 
        duration: 1000,
        easing: Easing.quad
      }),
      oneOut: Animated.timing(this.state.countdownAnimationValues.three, {
        toValue: {x: 1, y: 1},
        duration: 1000,
        easing: Easing.quad
      }),
      goIn: Animated.spring(this.state.countdownAnimationValues.goIn, { 
        toValue: 1,
        bounciness: 15, 
        speed: 2 
      }),   
      goOpacity: Animated.timing(this.state.countdownAnimationValues.goOpacity, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear
      }), 
      goOut: Animated.timing(this.state.countdownAnimationValues.goOut, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear
      }) 
 
    }   

    //set side of the track animations
    this.sidetrackAnim = { 
      running: Animated.timing(this.state.sidetrackAnimationValues.running, {
        toValue: 1, 
        duration: 800, 
        easing: Easing.linear
      })    
    }   

    //set up the car animations
    this.carAnimation = {
      rotateLeft: Animated.timing(this.state.carAnimationValues.rotateZ, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear 
      }),
      rotateRight: Animated.timing(this.state.carAnimationValues.rotateZ, {
        toValue: -1,
        duration: 600,
        easing: Easing.linear
      }), 
      resetRotation: Animated.timing(this.state.carAnimationValues.rotateZ, {
        toValue: 0,
        duration: 200,
        easing: Easing.exp
      }),
      moveRight: Animated.timing(this.state.carAnimationValues.moveX, {
        toValue: 1,
        duration: 600, 
        easing: Easing.linear
      }),
      moveLeft: Animated.timing(this.state.carAnimationValues.moveX, {
        toValue: -1,
        duration: 600,
        easing: Easing.linear
      }),
      drop: Animated.timing(this.state.carAnimationValues.extraMoveY, {
        toValue: -1,
        duration: 5000,
        easing: Easing.linear
      }),
      drop2: Animated.timing(this.state.carAnimationValues.extra2MoveY, {
        toValue: -1,
        duration: 8000,
        easing: Easing.linear
      }) 
    }   

    //set up the end animations after finishing race
    this.endAnim = {
      showMessage1: Animated.timing(this.state.endAnimValues.message1, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }),
      showMessage2: Animated.timing(this.state.endAnimValues.message2, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }),
      showMessage3Spring: Animated.spring(this.state.endAnimValues.message3, {
        toValue: 1,
        bounciness: 15, 
        speed: 2 
      }),
      showMessage3Rotate: Animated.timing(this.state.endAnimValues.message3, {
        toValue: 1,
        duration: 1000,
        easing: Easing.quad
      }),
      showMessage3Opacity: Animated.timing(this.state.endAnimValues.message3, {
        toValue: 1,
        duration:1000,
        easing: Easing.quad 
      })
    }

    this.finishLineAnim = Animated.timing(this.state.finishLineAnimValue, {
      toValue: -1,
      duration: 800,
      easing: Easing.linear
    }) 
    
  }      
 
  //animation starts here
  startAnimation() {

    //this is the countdown animation
    const countdownAnimations = [
      this.countdownAnim.threeIn, 
      Animated.parallel([ 
        this.countdownAnim.threeOut,
        this.countdownAnim.twoIn
      ]),
      Animated.parallel([
        this.countdownAnim.twoOut,
        this.countdownAnim.oneIn
      ]),
      this.countdownAnim.oneOut,
      Animated.parallel([
        this.countdownAnim.goIn, 
        this.countdownAnim.goOpacity       
      ]),
      this.countdownAnim.goOut     
    ] 
    //after the sequence finishes, call the main animation which starts
    //the side of the track animation and the cars and object animation
    Animated.sequence(countdownAnimations).start(()=>this.animateMain())  
  }
  

  animateMain() {
    this.animateTrack() 
    this.animateCarAndObjects()
  }

  //put the side of the track animation on a loop
  animateTrack() {
    this.state.sidetrackAnimationValues.running.setValue(0);
    this.sidetrackAnim.running.start(()=>this.animateTrack())
  }

  //animate the cars and other objects
  animateCarAndObjects() { 
    
    const createCarAnimation = (animType) => {
      if(animType==='moveLeft') {
        return Animated.parallel([
          Animated.sequence([
            this.carAnimation.rotateLeft,
            this.carAnimation.resetRotation
          ]),
          this.carAnimation.moveLeft
        ])
      }
   
      if(animType==='moveRight') {
        return Animated.parallel([
          Animated.sequence([
            this.carAnimation.rotateRight,
            this.carAnimation.resetRotation
          ]),
          this.carAnimation.moveRight
        ]) 
      } 
      
    }
 
    //this is the final seq. the ending message
    //use this as the last sequence in animation
    const finalSeq = Animated.sequence([
      this.endAnim.showMessage1,
      this.endAnim.showMessage2,
      Animated.parallel([
        this.endAnim.showMessage3Opacity,
        this.endAnim.showMessage3Rotate,
        this.endAnim.showMessage3Spring
      ])
    ]);

    /** ANIMATION SEQ STARTS HERE */
    Animated.sequence([
      Animated.delay(5000),
      //first car drop, delay 2s then move to left
      //car is dropping at right
      Animated.parallel([ 
        this.carAnimation.drop, //car dropping duration 5s
        Animated.sequence([
          Animated.delay(2000),
          createCarAnimation('moveLeft')
        ])
      ]), //total time 10s
      //stay at left for 6s 
      Animated.delay(6000),
      //second car drop, delay 3 then move left
      //car is dropping at left
      Animated.parallel([
        this.carAnimation.drop2, //car dropping duration 8s
        Animated.sequence([
          Animated.delay(3000),
          createCarAnimation('moveRight')
        ])
      ]), //total time 24 
      //wait half a second then show finish line
      Animated.delay(2000),
      this.finishLineAnim,
      //delay half second
      Animated.delay(500), 
      //show congratulations screen
      finalSeq
    ]).start() 
  }   
 
  componentDidMount() {  
    this.startAnimation()    
  }       
 
  //react native currently does not support repeat background
  //this function just imitates that.
  createImageTile(tileCount, image) {
   
    const arr = [];
    for(var x = 0; x < tileCount ; x++) {
      arr.push(<Image source={image} key={x}></Image>)
    }
    return arr;
  }

  render() { 
 
    //set up interpolation values for count down animation
    const countdownAnimInterp = { 
      threeY: this.state.countdownAnimationValues.one.y.interpolate({
        inputRange:   [0, 1], 
        outputRange:  [0, (height+countdownDim)/2]   
      }),   
      threeX: this.state.countdownAnimationValues.one.x.interpolate({  
        inputRange:   [0, 1],  
        outputRange:  [0, -width/2-countdownDim] 
      }), 
      twoY: this.state.countdownAnimationValues.two.y.interpolate({
        inputRange:   [0, 1],
        outputRange:  [0, height + countdownDim ] 
      }), 
      twoX: this.state.countdownAnimationValues.two.x.interpolate({ 
        inputRange:   [0, 1],
        outputRange:  [0, (width+countdownDim)/2]      
      }), 
      oneY: this.state.countdownAnimationValues.three.y.interpolate({
        inputRange:   [0, 1], 
        outputRange:  [0, -(height+countdownDim)/2]  
      }),  
      oneX: this.state.countdownAnimationValues.three.x.interpolate({ 
        inputRange:   [0, 1],
        outputRange:  [0, (width+countdownDim)/2]      
      }), 
      goOut: this.state.countdownAnimationValues.goOut.interpolate({
        inputRange:   [0, 1], 
        outputRange:  [0, -height/2 - 50]
      }),
      goOutRotate: this.state.countdownAnimationValues.goOut.interpolate({
        inputRange:   [0, 1],
        outputRange:  ['0deg', '360deg']
      })
 
    } 
    
    //interpolation for the side of the track
    const sidetrackAnimInterp = {
      slowStart: this.state.sidetrackAnimationValues.start.interpolate({
        inputRange:   [0, 1],
        outputRange:  [0, height] 
      }),  
      running: this.state.sidetrackAnimationValues.running.interpolate({
        inputRange: [0, 1],
        outputRange: [0, height]
      }) 
    }  

    //interpolation for car animations
    const carAnimInterp = {
      rotateZ: this.state.carAnimationValues.rotateZ.interpolate({
        inputRange:   [-1, 0, 1],
        outputRange:  ['10deg','0deg', '-10deg']
      }), 
      moveX: this.state.carAnimationValues.moveX.interpolate({
        inputRange:   [-1, 0, 1],
        outputRange:  [-width/6, 0, width/6]
      }),
      //extra cars dropping
      drop: this.state.carAnimationValues.extraMoveY.interpolate({
        inputRange:   [-1,0],
        outputRange:  [height+carHeight, 0]
      }),
      drop2: this.state.carAnimationValues.extra2MoveY.interpolate({
        inputRange:   [-1,0],
        outputRange:  [height+carHeight, 0]
      })    
    } 
 
    //interpolation for the finish line
    const finishLineInterp = this.state.finishLineAnimValue.interpolate({
      inputRange:     [-1, 0],
      outputRange:    [height+32, 0]
    })

    //interpolation for the rotation of the message at the end of race
    const message3RotateInterp = this.state.endAnimValues.message3.interpolate({
      inputRange:     [0, 1],
      outputRange:    ['0deg', '720deg']
    })
   
    //create a tiled background for finish line and side of the track
    const sidetrack = this.createImageTile(height/32 + 1, side);
    const finishLine = this.createImageTile(width/44 + 1, checkered) 
  
    return (      
      <View style={styles.container}> 

        {/** Create finish line*/}
        <Animated.View style={[styles.finish, {transform: [{translateY: finishLineInterp}]}]}>
          {finishLine} 
        </Animated.View>   

        {/* Create the cars */}  
        <Animated.Image source={car} style={[styles.car, {bottom:50, transform: [{rotateZ: carAnimInterp.rotateZ}, {translateX: carAnimInterp.moveX} ]}]} /> 
        <Animated.Image source={car1} style={[styles.car, {top:-carHeight, transform: [{translateX: width/6}, {translateY: carAnimInterp.drop}]}]} /> 
        <Animated.Image source={car1} style={[styles.car, {top:-carHeight, transform: [{translateX: -width/6}, {translateY: carAnimInterp.drop2}]}]} /> 
   
        {/* Create the side of the track */}     
        {/** LEFT SIDE */}  
        <Animated.View style={[styles.sidetrack, {left:0, transform: [{translateY: sidetrackAnimInterp.running}]}]}>   
          {sidetrack}        
        </Animated.View>      
        <Animated.View style={[styles.sidetrack, {left:0, top: -height, transform: [{translateY: sidetrackAnimInterp.running}]}]}> 
          {sidetrack}     
        </Animated.View> 

        {/** RIGHT SIDE */}
        <Animated.View style={[styles.sidetrack, {right:0, transform: [{translateY: sidetrackAnimInterp.running}]}]}> 
          {sidetrack}      
        </Animated.View>
        <Animated.View style={[styles.sidetrack, {right:0, top: -height, transform: [{translateY: sidetrackAnimInterp.running}]}]}> 
          {sidetrack}     
        </Animated.View>    


        {/*Create countdown*/}  
        <Animated.View style={[styles.countdown,{backgroundColor: 'red', top: -countdownDim,  
                              transform: [{translateY: countdownAnimInterp.threeY},{translateX: countdownAnimInterp.threeX}]}]}> 
        <Text style={styles.countdownText}> 3 </Text>         
        </Animated.View>      
        <Animated.View style={[styles.countdown, {backgroundColor: 'orange', left: -countdownDim, 
                              transform: [{translateY: countdownAnimInterp.twoY},{translateX: countdownAnimInterp.twoX}]}]}> 
        <Text style={styles.countdownText}> 2 </Text>    
        </Animated.View>     
        <Animated.View style={[styles.countdown, { backgroundColor: 'green', bottom: -countdownDim, 
                              transform: [{translateY: countdownAnimInterp.oneY},{translateX: countdownAnimInterp.oneX}]}]}> 
        <Text style={styles.countdownText}> 1 </Text>
        </Animated.View>  
        <Animated.View style={[styles.countdown,{ backgroundColor: 'green', 
                       opacity: this.state.countdownAnimationValues.goOpacity, 
                       transform: [{scale: this.state.countdownAnimationValues.goIn}, {translateY: countdownAnimInterp.goOut}, 
                                  {rotate: countdownAnimInterp.goOutRotate}]}]}>  
          <Text style={styles.countdownText}> Go </Text>     
        </Animated.View>   

        {/** CONGRATS SCREEN*/}
        <View style={{position: 'absolute', top: 50, justifyContent: 'center', alignItems: 'center'}}>  
          <Animated.Text style={[styles.endMessage, {opacity: this.state.endAnimValues.message1}]}> 
            You finished! Congratulations!    
          </Animated.Text> 
          <Animated.Text style={[styles.endMessage, {opacity: this.state.endAnimValues.message2}]}>     
            You're in  
          </Animated.Text>  
          <Animated.Text style={[styles.endMessage, {opacity: this.state.endAnimValues.message3, 
                                transform: [{scale: this.state.endAnimValues.message3}, {rotateZ: message3RotateInterp}]}]}>  
            8th Place 
          </Animated.Text >
        </View>
        
      </View>       
    ); 
  }  
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center', 
    justifyContent: 'center',
  }, 
  countdown: { 
    justifyContent: 'center',
    alignItems:'center',
    position: 'absolute', 
    width: countdownDim, 
    height: countdownDim,
    borderRadius: 50 
  },
  countdownText: {
    color: 'black', 
    fontWeight: 'bold',  
    fontSize: 24 
  },
  sidetrack: {
    height: height,
    width: width/8,
    backgroundColor: "#2F4F4F",
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center' 
  },
  car: {
    position: 'absolute', 
    width: carWidth, 
    height: carHeight
  },
  finish: {
    flex: 1, 
    width: width,
    height: 32,   
    position: 'absolute', 
    backgroundColor: 'black',
    alignItems: 'center',  
    flexDirection: 'row',
    top: -32   
  },
  endMessage: {
    opacity: 0,
    borderRadius: 20,
    color: 'white',
    backgroundColor: "#4C4CFF", 
    padding: 10, 
    marginTop: 15

  }  
}); 
 