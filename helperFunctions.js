function randomInRange(min, max){//min <= n < max
    return Math.floor(Math.random() * (max - min) + min);
}


function connect(xy, xy2, n, map){//connects a bridge between xy and xy2

    if(xy[0] === xy2[0]){//vertical
  
        for(let y = Math.min(xy[1], xy2[1]) + 1; y < Math.max(xy[1], xy2[1]); y++){
  
            if(n === 1){//single
                map[xy[0]][y] = 'a'
            } else if(n === 2){ map[xy[0]][y] = 'b'; }//double
        }
        
    }
  
    if(xy[1] === xy2[1]){//horizontal
  
        for(let x = Math.min(xy[0], xy2[0]) + 1; x < Math.max(xy[0], xy2[0]); x++){
  
            if(n === 1){
                map[x][xy[1]] = 'c';
            } else if(n === 2){ map[x][xy[1]] = 'd'; }
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


removeBridges = (map) => {
    let n = map.length;
  
    let map2 = [];
    for(let i = 0; i < n; i++){
        map2.push([]);
        for(let j = 0; j < n; j++){
  
            if(typeof(map[i][j]) === 'number'){
              map2[i].push(map[i][j]);
            } else{
              map2[i].push('');
            }
  
        }
    }
  
    return map2;
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


    expandMap([x, y], map);//generates the rest of the map with field x y as a starting point

    
    for(let i = 0; i < n; i++){
        for(let j = 0; j < n; j++){

            if(map[i][j] === 'F'){
                map[i][j] = assignNum(parseInt(i), parseInt(j), map);
            }

        }
    }
    return removeBridges(map);
}




//for functions with many arguments create an object that holds arguments they need
//write more comments

















//check solution

function checkEachField(map){//checks if all fields have correct number of bridges
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map.length; y++){

            if(typeof(map[x][y]) === 'number'){

                if(map[x][y] !== assignNum(x, y, map)){
                    return false;
                }

            }

        }
    } return true;
}




function findConnected2(x, y, isVertical, n, map){

    if(isVertical){
        if(map[x][y+n] === 'a' || map[x][y+n] === 'b'){
            //there is a field
            for(let i=y+n;; i+=n){
                if(typeof(map[x][i]) === 'number'){
                    return [x, i];
                }
            }
        }
        //there is no field
        return null;
    }

    if(map[x+n] !== undefined){
        if(map[x+n][y] === 'c' || map[x+n][y] === 'd'){

            for(let i=x+n;; i+=n){
                if(typeof(map[i][y]) === 'number'){
                    return [i, y];
                }
            }
        }
    }
    return null;
}


function findConnected(x, y, map){//returns fields that field xy is connected to
    let fields = [];

    fields.push(findConnected2(x, y, false, -1, map));//left
    fields.push(findConnected2(x, y, false, 1, map));//right
    fields.push(findConnected2(x, y, true, 1, map));//up
    fields.push(findConnected2(x, y, true, -1, map));//down

    return fields;
}


function contains(arr, arrOfarr){
    for(let i in arrOfarr){
        if(arrOfarr[0] === arr[0] && arrOfarr[1] === arr[1]){
            return true;
        }
    } return false;
}


function everythingIsConnected(map){

    let F; let foundFields = [];
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map.length; y++){
            if(typeof(map[x][y]) === 'number'){
                F = [x, y];
                break;
            }

        }
        if(F !== undefined){
            break;
        }
    }

    let fields = findConnected(F[0], F[1], map);
    foundFields.push(F);

    while(fields.length > 0){

        for(let i = 0; i < fields.length; i++){
            if(fields[i] !== null && contains(fields[i], foundFields)){//if field is not yet found add it to found, run it through findConnected and then remove it
                let result = findConnected(fields[i][0], fields[i][1], map);
                foundFields.push(fields[i]);
                fields.splice(i, 1); i--;
                for(let j in result){
                    fields.push(result[j]);
                }
            }
            else{//if field is null or already found remove it
                fields.splice(i, 1); i--;
            }
        }
        
    }

    //check if foundFields includes every field on a map
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map.length; y++){

            if(typeof(map[x][y]) === 'number'){
                
                if(contains([x, y], foundFields)){
                    return false;
                }

            }

        }
    } return true;
}

export function isCompleted(map){
    if(!checkEachField(map)){
        return false;
    }
    if(!everythingIsConnected(map)){
        return false;
    }
    return true;
}