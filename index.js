import chalk from "chalk";

// SpitWSpots's Coords
// var lat = 59.646;
// var long = -151.538;
// var zoom = 1;
// var mapWidth = 5;
// var mapHeight = 5;

// Alaska
var lat = 71.793;
var long = -170.318;
var zoom = 1;
var mapWidth = 40;
var mapHeight = 18;

// Kenai Peninsula
// var lat = 61.077;
// var long = -152.318;
// var zoom = 0.166;
// var mapWidth = 24;
// var mapHeight = 18;

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
                switch(cell){
                    case "N":
                        // return "↑";
                        row.push(chalk.rgb(128, 242, 185).inverse("↑"));
                        break;
                    case "NE":
                        // return "↗";
                        row.push(chalk.rgb(206, 211, 185).inverse("↗"));
                        break;
                    case "E":
                        // return "→";
                        row.push(chalk.rgb(242, 128, 185).inverse("→"));
                        break;
                    case "SE":
                        // return "↘";
                        row.push(chalk.rgb(213, 52, 185).inverse("↘"));
                        break;
                    case "S":
                        // return "↓";
                        row.push(chalk.rgb(127, 13, 185).inverse("↓"));
                        break;
                    case "SW":
                        // return "↙";
                        row.push(chalk.rgb(45, 48, 185).inverse("↙"));
                        break;
                    case "W":
                        // return "←";
                        row.push(chalk.rgb(13, 128, 185).inverse("←"));
                        break;
                    case "NW":
                        // return "↖";
                        row.push(chalk.rgb(48, 210, 185).inverse("↖"));
                        break;
                    default:
                        row.push(chalk.rgb(127, 127, 255).inverse("."));
                }
                // row.push(cell);
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
        return await getWind(office, x, y);
    }
    catch(error){
        return ",";
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
        return "."
    }
}

// var alaska = new Map(42, 20, zoom, lat, long);
// alaska.fill();

var windMap = new Map(mapWidth, mapHeight, zoom, lat, long);
windMap.fill();