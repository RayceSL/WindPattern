// import * as chalk from "chalk";

var lat = 60;
var long = -150;

class Map {
    constructor(_width, _height){
        this.width = _width;
        this.height = _height;
        this.map = [];
    }
    fill(){
        for(let i = 0; i < this.height; i++){
            let row = [];
            for(let j = 0; j < this.width; j++){
                row.push(getPoints(lat + i, long + j));
            }
            this.map.push(row);
        }
    }
    log() {
        for (let i = 0; i < this.map.length; i++) {
            console.log(this.map[i].join(""));
        }
    }
}

async function getPoints(_lat, _long){
    try{
        const RESPONSE = await fetch(`https://api.weather.gov/points/${_lat},${_long}`);
        if(!RESPONSE.ok){
            throw new Error();
        }
        const DATA = await RESPONSE.json()        
        var x = DATA.properties.gridX;
        var y = DATA.properties.gridY;
        var office = DATA.properties.gridId;
        return getWind(office, x, y);
    }
    catch(error){
        console.log(error);
    }
}

async function getWind(_office, _x, _y) {
    try {
        const RESPONSE = await fetch(`https://api.weather.gov/gridpoints/${_office}/${_x},${_y}/forecast`);
        if(!RESPONSE.ok){
            throw new Error();
        }
        const DATA = await RESPONSE.json();
        const WIND = DATA.properties.periods[0].windDirection;
        switch (WIND) {
            case "N":
                // console.log("↑");
                // break;
                return "↑";
            case "NE":
                // console.log("↗");
                // break;
                return "↗";
            case "E":
                // console.log("→");
                // break;
                return "→";
            case "SE":
                // console.log("↘");
                // break;
                return "↘";
            case "S":
                // console.log("↓");
                // break;
                return "↓";
            case "SW":
                // console.log("↙");
                // break;
                return "↙";
            case "W":
                // console.log("←");
                // break;
                return "←";
            case "NW":
                // console.log("↖");
                // break;
                return "↖";
            default:
                // console.log("?");
                // break;
                return "?";
        }
    }
    catch(error) {
        console.log(error);
    }
}

// getPoints(lat, long);

const MAP_A = new Map(5,5);

MAP_A.fill();
MAP_A.log();