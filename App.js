import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Animated, PanResponder } from 'react-native';

const assets = {
  jelly: {
    shape1: require('./assets/jelly/shape1.png'),
    shape2: require('./assets/jelly/shape2.png'),
    shape3: require('./assets/jelly/shape3.png'),
    shape4: require('./assets/jelly/shape4.png'),
    shape5: require('./assets/jelly/shape5.png'),
    shape6: require('./assets/jelly/shape6.png'),
    shape7: require('./assets/jelly/shape7.png'),
    shape8: require('./assets/jelly/shape8.png')
  }
};


//temporary
const map = [[2, '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', 1]];



//functions
returnCoordinate = (length, location, n) => {
  c = Math.floor(location / (length/n));

  if(c<0 || c>=n){
    return -1;
  }
  return c;
}





class Field extends React.Component{

  state = {
    flexValue: new Animated.Value(0.7),
    selected: false//this.props.selected
  }

  growAnimation = () => {
    Animated.timing(this.state.flexValue, {
      toValue: 1,
      duration: 500,
    }).start();
  }

  render(){

    if(typeof(this.props.field) === 'number'){
      
      return(

        <View style={styles.field} pointerEvents='none'>
          <Animated.Image style={{flex: this.state.flexValue}} source={assets.jelly['shape' + this.props.field]} resizeMode='contain' ></Animated.Image>
        </View>

      )
    }


    //empty field
    return(
      
      <View style={styles.field}>
      <Text>{this.props.field}</Text>
      </View>
      
    )
  }
}


class Column extends React.Component{

  render(){

    return(

      <View style={styles.column}>
        {this.props.column.map((field, index) => <Field field = {field} key = {index} />)}
      </View>

    )
  }
}





class Map extends Component{
  state = {
    n: 4,
    width: null,
    height: null,
    field1: null,
    field2: null,
  }

  constructor(props){
    super(props);

    this.state.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {

        let x = returnCoordinate(this.state.width, evt.nativeEvent.locationX, this.state.n);
        let y = returnCoordinate(this.state.height, evt.nativeEvent.locationY, this.state.n);

        if(x>=0 && y>=0){
          if(typeof(map[x][y]) === 'number'){
            this.setState({field1: [x, y]}, function () {console.log('field1 ', this.state.field1[0], this.state.field1[1]);} );
          }
        }

      },
      onPanResponderMove: (evt, gestureState) => {

        
        if(this.state.field1){

          let x = returnCoordinate(this.state.width, evt.nativeEvent.locationX, this.state.n);
          let y = returnCoordinate(this.state.height, evt.nativeEvent.locationY, this.state.n);

          if(x>=0 && y>=0 && (this.state.field1[0] !== x || this.state.field1[1] !== y)){

            if(this.state.field2 !== null && typeof(map[x][y]) === 'number'){
              
              if(this.state.field2[0] !== x || this.state.field2[1] !== y){

                this.setState({field2: [x, y]});
              
              }

            }

            else if(typeof(map[x][y]) === 'number'){
              this.setState({field2: [x, y]}, function () {console.log('field2 ', this.state.field2[0], this.state.field2[1]);})
            }
            
            else if(this.state.field2 !== null){
              this.setState({field2: null}, function () {console.log('field2 ', this.state.field2);});
            }

          }
          else if(this.state.field2 !== null){
            this.setState({field2: null}, function () {console.log('field2 ', this.state.field2);});
          }

        }

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {

        console.log('release');
        this.setState({field1: null, field2: null});

      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }


  


  render(){
    return(

      <View style={styles.map} onLayout={(event) => this.setState({width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height})} {...this.state.panResponder.panHandlers}>
        {this.props.map.map((column, index) =>  <Column column = {column} key = {index} />)}
      </View>

    )
  }
}


export default class App extends Component{

  render(){
    return(

      <View style={styles.app}>
        <Map map={map}></Map>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: 280,
    width: 280,
    backgroundColor: '#dbdbdb',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,//

  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  field: {
    flex: 1,
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jellyPressed: {
    flex: 1,
  },
  jelly: {
    flex: 0.7,
  },
});


//I wrote some notes in the map's panresponder to work on today


//
//make jelly light up when it has correct number of connections