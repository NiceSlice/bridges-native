import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, PanResponder, Button,} from 'react-native';
import { generateMap } from './helperFunctions';
import { isCompleted } from './helperFunctions';


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





//functions
returnCoordinate = (length, location, n) => {
  c = Math.floor(location / (length/n));

  if(c<0 || c>=n){
    return -1;
  }
  return c;
}



changeBridge = (x, y, x2, y2, map) => {//rename the function
  let noneToSingle = true;

  if(x === x2){

    for(let i = Math.min(y, y2) + 1; i < Math.max(y, y2); i++){

      if(map[x][i] === 'a'){//if single bridge make it double
        for(let i = Math.min(y, y2) + 1; i < Math.max(y, y2); i++){
          map[x][i] = 'b'
        }
        noneToSingle = false;
        break;
      }

      else if(map[x][i] === 'b'){//if double bridge erase it
        for(let i = Math.min(y, y2) + 1; i < Math.max(y, y2); i++){
          map[x][i] = ''
        }
        noneToSingle = false;
        break;
      }

      else if(map[x][i] !== ''){//if something else don't continue
        noneToSingle = false;
        break;
      }
    }

    if(noneToSingle){//if nothing is between fields make a single bridge
      for(let i = Math.min(y, y2) + 1; i < Math.max(y, y2); i++){
        map[x][i] = 'a'
      }
    }
  }

  else if(y === y2){

    for(let i = Math.min(x, x2) + 1; i < Math.max(x, x2); i++){

      if(map[i][y] === 'c'){
        for(let i = Math.min(x, x2) + 1; i < Math.max(x, x2); i++){
          map[i][y] = 'd';
        }
        noneToSingle = false;
        break;
      }

      else if(map[i][y] === 'd'){
        for(let i = Math.min(x, x2) + 1; i < Math.max(x, x2); i++){
          map[i][y] = '';
        }
        noneToSingle = false;
        break;
      }

      else if(map[i][y] !== ''){
        noneToSingle = false;
        break;
      }
    }

    if(noneToSingle){
      for(let i = Math.min(x, x2) + 1; i < Math.max(x, x2); i++){
        map[i][y] = 'c';
      }
    }
  }
}



class Field extends React.Component{

  state = {
    flexValue: new Animated.Value(0.7),
    selected: false,
  }


  selectJelly = (select) => {

    if(select){
      Animated.timing(this.state.flexValue, {
        toValue: 1,
        duration: 80,
      }).start();
    }
    else{
      Animated.timing(this.state.flexValue, {
        toValue: 0.7,
        duration: 80,
      }).start();
    }

  }

  isSelected = () => {

    if((this.props.field1 || this.props.field2) && !this.state.selected){
      this.setState({selected: true}, () => {
        this.selectJelly(this.state.selected);
      });
    }

    else if(!this.props.field1 && !this.props.field2 && this.state.selected){
      this.setState({selected: false}, () => {
        this.selectJelly(this.state.selected);
      });
    }

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
      
      <View style={styles.field} pointerEvents="none">
      </View>
      
    )
  }

  componentDidUpdate(){

    this.isSelected();

  }

}



function Column(props){
  return(
    <View style={styles.column}>

      {props.column.map((field, index) => {

        if(props.field1 !== null){

          if(index === props.field1[1]){
            return(
              <Field field = {field} key = {index} field1 = {true} field2 = {false} />
            )
          }

        }

        if(props.field2 !== null){

          if(index === props.field2[1]){
            return(
              <Field field = {field} key = {index} field1 = {false} field2 = {true} />
            )
          }

        }

        return(
          <Field field = {field} key = {index} field1 = {false} field2 = {false} />
        )

      })}

      </View>
  )
}


function Bridge(props){
  return(
    <View style={[styles.bridge, props.bridgeStyles(props.x, props.y, props.type)]} pointerEvents="none" ></View>
  )
}


class Map extends Component{
  state = {
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

        let x = returnCoordinate(this.state.width, evt.nativeEvent.locationX, this.props.n);
        let y = returnCoordinate(this.state.height, evt.nativeEvent.locationY, this.props.n);

        if(x>=0 && y>=0){
          if(typeof(this.props.map[x][y]) === 'number'){
            this.setState({field1: [x, y]});
          }
        }

      },
      onPanResponderMove: (evt, gestureState) => {

        
        if(this.state.field1){

          let x = returnCoordinate(this.state.width, evt.nativeEvent.locationX, this.props.n);
          let y = returnCoordinate(this.state.height, evt.nativeEvent.locationY, this.props.n);

          if(x>=0 && y>=0 && (this.state.field1[0] !== x || this.state.field1[1] !== y)){

            if(this.state.field2 !== null && typeof(this.props.map[x][y]) === 'number'){
              
              if(this.state.field2[0] !== x || this.state.field2[1] !== y){

                this.setState({field2: [x, y]});
              
              }

            }

            else if(typeof(this.props.map[x][y]) === 'number'){
              this.setState({field2: [x, y]})
            }
            
            else if(this.state.field2 !== null){
              this.setState({field2: null});
            }

          }
          else if(this.state.field2 !== null){
            this.setState({field2: null});
          }

        }

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {

        if(this.state.field1 !== null && this.state.field2 !== null){
          changeBridge(this.state.field1[0], this.state.field1[1], this.state.field2[0], this.state.field2[1], this.props.map);
        }

        this.setState({field1: null, field2: null});

      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }


  bridgeStyles = (x, y, type) => {
    if(type === 'a'){
      return{
        width: (this.state.width/this.props.n)/2,
        height: (this.state.height/this.props.n),
        top: ((this.state.height/this.props.n) * y),
        left: ((this.state.width/this.props.n) * x) + ((this.state.width/this.props.n)/4),
        backgroundColor: '#bab6b6',
      }
    }
    if(type === 'b'){
      return{
        width: (this.state.width/this.props.n)/2,
        height: (this.state.height/this.props.n),
        top: ((this.state.height/this.props.n) * y),
        left: ((this.state.width/this.props.n) * x) + ((this.state.width/this.props.n)/4),
        backgroundColor: '#858181',
      }
    }
    if(type === 'c'){
      return{
        width: (this.state.width/this.props.n),
        height: (this.state.height/this.props.n)/2,
        top: ((this.state.height/this.props.n) * y) + ((this.state.height/this.props.n)/4),
        left: ((this.state.width/this.props.n) * x),
        backgroundColor: '#bab6b6',
      }
    }
    if(type === 'd'){
      return{
        width: (this.state.width/this.props.n),
        height: (this.state.height/this.props.n)/2,
        top: ((this.state.height/this.props.n) * y) + ((this.state.height/this.props.n)/4),
        left: ((this.state.width/this.props.n) * x),
        backgroundColor: '#858181',
      } 
    }
  }
  



  render(){

    return(

      <View style={styles.map} onLayout={(event) => this.setState({width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height})} {...this.state.panResponder.panHandlers}>

      {this.props.map.map((column, index) =>  {
  
        //field1 and 2 are unset
        if(this.state.field1 === null && this.state.field2 === null){
          return(
            <Column column = {column} key = {index} field1 = {this.state.field1} field2 = {this.state.field2} />
          )
        }
  
        //only field1 is set
        if(this.state.field2 === null){
  
          //field1 matches with index
          if(index === this.state.field1[0]){
            return(
              <Column column = {column} key = {index} field1 = {this.state.field1} field2 = {this.state.field2} />
            )
          }
  
          //field1 doesn't match with index
          else{
            return(
              <Column column = {column} key = {index} field1 = {null} field2 = {this.state.field2} />
            )
          }
  
        }
  
        //field1 and 2 are set
        //index matches with field1 but not with field2
        if(index === this.state.field1[0] && index !== this.state.field2[0]){
          return(
            <Column column = {column} key = {index} field1 = {this.state.field1} field2 = {null} />
          )
        }
        //index matches with field2 but not with field1
        if(index === this.state.field2[0] && index !== this.state.field1[0]){
          return(
            <Column column = {column} key = {index} field1 = {null} field2 = {this.state.field2} />
          )
        }
        //index matches with both fields
        if(index === this.state.field1[0] && index === this.state.field2[0]){
          return(
            <Column column = {column} key = {index} field1 = {this.state.field1} field2 = {this.state.field2} />
          )
        }
  
        //index doesn't match with either
        return(        
          <Column column = {column} key = {index} field1 = {null} field2 = {null} />
        )
  
      })}

    

      {this.props.map.map((column, x) => {

        return(

          column.map((field, y) => {

            if(typeof(field) !== 'number' && field !== ''){

              return(
                <Bridge bridgeStyles={this.bridgeStyles} x={x} y={y} key={x.toString() + y.toString()} type={field} ></Bridge>
              )
            }
          })
        )
      })}

      </View>

    )

  }

  componentDidUpdate(){
    if(isCompleted(this.props.map)){
      this.props.complete(true);
    }
  }
}


function SizePicker(props){

  return(

    <View style={styles.sizePicker}>

      <TouchableOpacity style={styles.sizePlusMinus} onPress={() => { props.changeN(false) }}>
        <Text>-</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sizePlusMinus} onPress={() => { props.changeN(true) }}>
        <Text>+</Text>
      </TouchableOpacity>

    </View>
  
  )
}




export default function App(){
  const [n, setN] = useState(4);//define initial n
  const [map, setMap] = useState(generateMap(4));//DRY
  const [completed, setCompleted] = useState(false);

  changeN = (isPlus) => {

    if(isPlus && n < 10){//define upper limit
      setN(n+1);
      setMap(generateMap(n+1));//DRY
    }
    else if(!isPlus && n > 4){//define lower limit
      setN(n-1);
      setMap(generateMap(n-1));//DRY
    }
  }

  complete = (isCompleted) => {

    if(!isCompleted){
      setMap(generateMap(n));
      setCompleted(false);
    }
    else{
      setCompleted(true);
    }
  }



  if(completed){
    return(

      <View style={styles.app}>

        <Map map = {map} n = {n} complete = {complete} ></Map>

        <View style={{marginTop: 30}}>

          <Text style={{margin: 10}} >You completed the game!</Text>
          <Button title='New' onPress={() => { complete(false); }} ></Button>

        </View>

      </View>

    )
  }
  return(
    <View style={styles.app}>

      <Map map = {map} n = {n} complete = {complete} ></Map>

      <SizePicker changeN = {changeN} ></SizePicker>

    </View>
  )
  
}







const styles = StyleSheet.create({
  app: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    marginTop: 150,
    height: 300,
    width: 300,
    backgroundColor: '#dbdbdb',
    flexDirection: 'row',
    borderRadius: 10,

  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  field: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sizePicker: {
    margin: 15,
    marginTop: 20,
    flexDirection: 'row',
  },
  sizePlusMinus: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    backgroundColor: '#dbdbdb',
    margin: 20,
    borderRadius: 10,
  },
  
  bridge: {
    position: 'absolute',
    backgroundColor: '#bab6b6',
  },
  
});





/*
found a bug

2 d d 2
' ' ' '
1 c c 1

returns true on is completed
*/









//add filter on generated maps