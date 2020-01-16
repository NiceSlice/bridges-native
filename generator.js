function printMap(map){

    let line;

    for(let x in map){
        line = '';
        for(let y in map[x]){
            if(map[x][y] === ''){
                line += ' ';
            }
            else if(map[x][y] === 'a' || map[x][y] === 'b'){
                line += '-';
            } 
            else if(map[x][y] === 'c' || map[x][y] === 'd'){
                line += '|';
            }
            else{
                line += map[x][y];
            }
        }
        console.log(line);
    }
}


function randomInRange(min, max){//min <= n < max
    return Math.floor(Math.random() * (max - min) + min);
}


function connect(xy, xy2, n, map){//connects or erases bridge between xy and xy2

    if(xy[0] === xy2[0]){//vertical
  
        for(let y = Math.min(xy[1], xy2[1]) + 1; y < Math.max(xy[1], xy2[1]); y++){
  
            if(n === 1){
                map[xy[0]][y] = 'a'
            } else if(n === 2){ map[xy[0]][y] = 'b'; }
            else if(n === 3){ map[xy[0]][y] = ''; }//erase
        }
        
    }
  
    if(xy[1] === xy2[1]){//horizontal
  
        for(let x = Math.min(xy[0], xy2[0]) + 1; x < Math.max(xy[0], xy2[0]); x++){
  
            if(n === 1){
                map[x][xy[1]] = 'c';
            } else if(n === 2){ map[x][xy[1]] = 'd'; }
            else if(n === 3){ map[x][xy[1]] = ''; }
        }
    }
}


function BridgeOut4(x, x2, y, isX, map){
    if(isX){
        if(map[x2][y+1] === 'F' || map[x2][y-1] === 'F'){//if there are fields next to the new field it doesn't get created
            return null;
        }
        map[x2][y] = 'F';//new field
        connect([x, y], [x2, y], randomInRange(1, 3), map);//double or single bridge
        return [x2, y];
    }
    else{
        if(map[y+1] !== undefined){
            if(map[y+1][x2] === 'F'){
                return null;
            }
        }
        if(map[y-1] !== undefined){
            if(map[y-1][x2] === 'F'){
                return null;
            }
        }
        map[y][x2] = 'F';
        connect([y, x], [y, x2], randomInRange(1, 3), map);
        return [y, x2];
    }
}

function BridgeOut3(x, y, i, isX, a, b, map){//

    let x2;
    if(x - 1 > i + a){
        x2 = randomInRange(i+a, x-1);
    }
    else if(i + b > x + 2){
        x2 = randomInRange(x+2, i + b)
    } else{
        return null;
    }

    return BridgeOut4(x, x2, y, isX, map);
}

function BridgeOut2(x, y, a, b, isX, map){//x is the coordinate of field on axis that we are moving across

    for(let i = x + b; i != a; i = i + b){
        
        let xy = (isX ? map[i][y] : map[y][i]);
        
        //if xy is marked field
        if(xy === 'F'){
            return (BridgeOut3(x, y, i, isX, 2, -1, map));
        }
        //if xy is marked bridge
        else if(xy !== ''){
            return (BridgeOut3(x, y, i, isX, 1, 0, map));
        }
        //if xy is on the edge of the map
        else if(i + b === a){
            return (BridgeOut3(x, y, i, isX, 0, 1, map));
        }
    } return null;
}



function bridgeOut(xy, map){//makes new fields that connect with xy field
    //I split this function in four functions because it was very repetitive

    let newFields = [];//new fields are listed to be run through the function as well

    newFields.push(BridgeOut2(xy[0], xy[1], -1, -1, true, map));//left
    newFields.push(BridgeOut2(xy[0], xy[1], map.length, 1, true, map));//right
    newFields.push(BridgeOut2(xy[1], xy[0], -1, -1, false, map));//up
    newFields.push(BridgeOut2(xy[1], xy[0], map.length, 1, false, map));//down
    
    return newFields;
}




function expandMap(xy, map){//uses recursion to call bridgeOut on all new fields that bridgeOut created
    let newFields = bridgeOut(xy, map);
   
    for(let i in newFields){
        if(newFields[i] !== null){
            expandMap(newFields[i], map);
        }
    }
    return;
}





function countBridge(x, y, countVertical, map){//a vertical single, b vertical double, c horizontal single, d horizontal double
    if(map[x] === undefined){
        return 0;
    }
    if(map[x][y] === undefined || map[x][y] === ''){
        return 0;
    }

    if((countVertical && map[x][y] === 'a') || (!countVertical && map[x][y] === 'c')){
        return 1;
    }
    if((countVertical && map[x][y] === 'b') || (!countVertical && map[x][y] === 'd')){
        return 2;
    } return 0;
}

function assignNum(x, y, map){//assignes a number to field equal to the number of bridges that the field connects to

    let num = 0;
    num += countBridge(x-1, y, false, map) + countBridge(x+1, y, false, map) + countBridge(x, y-1, true, map) + countBridge(x, y+1, true, map);
    
    return num;
}



export function generateMap(n){

    let map = [];
    for(let i = 0; i < n; i++){//creating empty map
        map.push([]);
        for(let j = 0; j < n; j++){
            map[i].push('');
        }
    }

    //creating a random first field
    let x = randomInRange(0, n); let y = randomInRange(0, n);
    map[x][y] = 'F';


    expandMap([x, y], map);//generates the rest of the map from one field

    
    for(let i = 0; i < n; i++){
        for(let j = 0; j < n; j++){

            if(map[i][j] === 'F'){
                map[i][j] = assignNum(parseInt(i), parseInt(j), map);
            }

        }
    }
    
    return map;
}

/*
function test2(){
    console.log('function call successful');
}

export function test(){
   console.log('export successful');
   test2();
}
*/



//connect with App.js
//for functions with many arguments create an object that holds arguments they need
//write more comments