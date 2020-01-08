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

const map = [[1, "", "", ""], ["", 2, "", ""], ["", "", 3, ""], [1, "", "", 4]];

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

    if(typeof(this.props.field) === "number"){
      
      return(

        <View style={styles.field}>
          <Animated.Image style={{flex: this.state.flexValue}} source={assets.jelly['shape' + this.props.field]} resizeMode="contain" ></Animated.Image>
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

  }

  constructor(props){
    super(props);

    this.state.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {

        /*
        x = evt.locationX / n - 1
        y = evt.locationY / n - 1

        field1 = (x, y)

        if a numbered send a massage to field that it has been selected during the whole duration of touch
        */

      },
      onPanResponderMove: (evt, gestureState) => {
        
        /*
        x = evt.locationX / n - 1
        y = evt.locationY / n - 1

        if a numbered and if field1 is selected send a massage to field that it has been selected temporarily
        */

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        /*
        x = evt.locationX / n - 1
        y = evt.locationY / n - 1

        field2 = (x, y)

        if a numbered and if field1 is selected connect field1 and field2
        well actually some additional rules will come with connecting like no going through jelly or bridges
        and no connectiong jelly that's side by side or not in the same row/column

        for now just get the selection process right
        */
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

      <View style={styles.map} {...this.state.panResponder.panHandlers}>
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