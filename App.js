import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableWithoutFeedback } from 'react-native';

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

const map = [[1, "", "", ""], ["", 2, "", ""], ["", "", 3, ""], ["", "", "", 4]];

class Field extends React.Component{

  state = {
    pressed: false
  }

  render(){

    if(typeof(this.props.field) === "number"){

      if(this.state.pressed){
        return(

          <TouchableWithoutFeedback onPress = {() => {this.setState({ pressed: true })}} >
            <View style={styles.field} >
              <Image style={[styles.jelly, styles.jellyPressed]} source={assets.jelly['shape' + this.props.field]} resizeMode="contain" ></Image>
            </View>
          </TouchableWithoutFeedback>

        )
      }
      
      return(

        <TouchableWithoutFeedback onPress = {() => {this.setState({ pressed: true })}} >
          <View style={styles.field} >
            <Image style={styles.jelly} source={assets.jelly['shape' + this.props.field]} resizeMode="contain" ></Image>
          </View>
        </TouchableWithoutFeedback>

      )
    }

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

  render(){
    return(

      <View style={styles.map}>
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
  }
});


//think about the use of touchables and onPress
//learn about how animations are made