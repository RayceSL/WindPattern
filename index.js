// import * as chalk from "chalk";

var lat = 60;
var long = -150;
var wind;

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
                getPoints(lat + i, long + j)
                row.push(wind);
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
            throw new Error("Position invalid");
        }
        const DATA = await RESPONSE.json()        
        var x = DATA.properties.gridX;
        var y = DATA.properties.gridY;
        var office = DATA.properties.gridId;
        getWind(office, x, y);
        return wind;
    }
    catch(error){
        wind = "X";
        return wind;
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
                wind = "↑";
            case "NE":
                wind = "↗";
            case "E":
                wind = "→";
            case "SE":
                wind = "↘";
            case "S":
                wind = "↓";
            case "SW":
                wind = "↙";
            case "W":
                wind = "←";
            case "NW":
                wind = "↖";
            default:
                wind = "?";
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