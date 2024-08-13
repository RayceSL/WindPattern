import * as chalk from "chalk";

// SpitWSpots's Coords
// var lat = 59.646;
// var long = -151.538;

// Alaska's Coords
var lat = 71.793;
var long = -170.318;

// World's Coords
// var lat = 90;
// var long = -180;


class Map {
    constructor(_width, _height, _zoom, _lat, _long){
        this.width = _width;
        this.height = _height;
        this.zoom = _zoom;
        this.lat = _lat;
        this.long = _long;
    }
    async fill(){
        console.log(`Wind patterns starting at (${(this.lat - this.height * this.zoom) + 1}, ${this.long}) to (${this.lat}, ${(this.long + this.width * this.zoom) + 1})\nYou\n↓`)
        for(let i = 0; i < this.height; i++){
            let row = [];
            for(let j = 0; j < this.width; j++){
                let cell = await getPoints(this.lat - i * this.zoom, this.long + j * this.zoom);
                row.push(cell);
            }
            console.log(row.join(""));
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
        var arrow = await getWind(office, x, y);
        switch(arrow){
            case "N":
                return "↑";
            case "NE":
                return "↗";
            case "E":
                return "→";
            case "SE":
                return "↘";
            case "S":
                return "↓";
            case "SW":
                return "↙";
            case "W":
                return "←";
            case "NW":
                return "↖";
            default:
                return "_";
        }
    }
    catch(error){
        return "_";
    }
}

async function getWind(_office, _x, _y) {
    try {
        const RESPONSE = await fetch(`https://api.weather.gov/gridpoints/${_office}/${_x},${_y}/forecast`);
        if(!RESPONSE.ok){
            throw new Error();
        }
        const DATA = await RESPONSE.json();
        const DIR = DATA.properties.periods[0].windDirection;
        return DIR;
    }
    catch(error) {
        return;
    }
}

var alaska = new Map(42, 20, 1, lat, long);
alaska.fill();