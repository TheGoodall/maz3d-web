// TODO: PLACEHOLDERS
var placeholder_map_matrix = 	[
		[1,0,0,1,0,0,1],
		[1,1,0,1,0,1,1],
		[1,1,0,1,0,1,1],
		[1,1,0,1,0,1,1],
		[1,1,0,1,0,1,1],
		[1,1,0,1,0,1,1],
		[1,1,0,1,0,1,1],
		[1,1,0,1,0,1,1],
	]
var placeholder_map_matrix2 =   [
    [1, 0],
    [0, 1]
]
var placeholder_portals =   [
    [[0, 0, 0, 0], [1, 4, 4, 2]],
    [[0, 3, 4, 2], [0, 1, 1, 1]],
    [[0, 1, 0, 0], [2, 2, 2, 2]]
]
var placeholder_floor_number = 1



// Initialise image variables for portals.
let in_pic_0;
let in_pic_1;
let in_pic_2;
let in_pic_3;

let out_pic_0;
let out_pic_1;
let out_pic_2;
let out_pic_3;

var map_matrix = [];
var position;
var floor_number; // Current floor number.
var map_width;
var map_height;
var canvas_scale = 100;  // TODO: Fix scaling.
var portals_list;
var current_in_floor_portals = []; // List of "in" portals relating to current floor.
var current_out_floor_portals = []; // List of "out" portals relating to the current floor.

var floor_colour_r;
var floor_colour_g;
var floor_colour_b;

function httpGet(theURL) {
    var xmlHTTP = new xmlHTTP();
    xmlHTTP.open("GET", theURL, false);
    xmlHTTP(null);
    return xmlHTTP.responceText;
}

function parseJson(jsonData)
{
    if(jsonData.hasOwnProperty("Maps")) {
        // A new map has been optained.
        httpGet('http://192.168.1.171:8080/id').then((floor => {

            console.log(floor)
            floor = parseInt(floor)

            switch (floor) {
                case 0:
                    floor_colour_r = 0
                    floor_colour_g = 0
                    floor_colour_b = 0
                    console.log("White")
                    break;

                case 1:
                    floor_colour_r = 245
                    floor_colour_g = 181
                    floor_colour_b = 61
                    console.log("gold")
                    break;

                case 2:
                    floor_colour_r = 61
                    floor_colour_g = 245
                    floor_colour_b = 211
                    console.log("case 3")
                    break;

                case 3:
                    floor_colour_r = 61
                    floor_colour_g = 196
                    floor_colour_b = 245
                    console.log("case 4")
                    break;

                case 4:
                    floor_colour_r = 232
                    floor_colour_g = 56
                    floor_colour_b = 220
                    console.log("case 5")
                    break;

                case 5:
                    floor_colour_r = 159
                    floor_colour_g = 61
                    floor_colour_b = 245
                    console.log("case 6")
                    break;

            }

            floor_number = floor
            map_matrix = jsonData["Maps"][floor-1];
            portals_list = jsonData["Portals"];
            console.log(map_matrix);

            // Set size of the canvas.
            map_x = map_matrix[0].length
            map_y = map_matrix.length

            // Scale the map on the screen.
            map_width = canvas_scale * map_x
            map_height = canvas_scale * map_y

            // Create canvas with sufficient size.
            createCanvas(map_width, map_height)

            empty_location = [] // TODO: New
            mapFlag = true;
        })); // TODO: Change this when available.



    }
    else
    {
        position = jsonData;
        console.log(position);

    }
}

// Flags whether or not map has been received.
let mapFlag = false;

// Parsing JSON. TODO: Uncomment this when done.
e = new EventSource('http://192.168.1.171:8080/events/game');
e.onmessage = function(event) {
    console.log(event.data);
    console.log("PRICK")  // TODO: Remove this when done.
    var jsonData = JSON.parse(event.data);
    parseJson(jsonData)
};

// TODO: Remove below when done.
// parseJson({"Maps":[[[false,false,false,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,true,false,true,false,true,false],[true,false,true,false,true,false,true,false,false,true,false,true,false]],[[true,false,true,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,true,false,true,false,true,false],[true,false,true,false,true,false,true,false,false,true,false,true,false]],[[true,false,true,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,true,false,true,false,true,false],[true,false,true,false,true,false,true,false,false,true,false,true,false]]],
//     "Portals":[{"In":{"World":1,"X":2,"Y":2,"Rotation":3},"Out":{"World":1,"X":5,"Y":2,"Rotation":2}},{"In":{"World":5,"X":6,"Y":7,"Rotation":1},"Out":{"World":4,"X":5,"Y":6,"Rotation":7}}]})

// This variable contains a list of where all of the empty spaces should be
// ie, the places that the player should be able to walk through.
var empty_location = [];

var map_x
var map_y

// Preloads the images for the portals. TODO: Finish this.
function preload() {
    in_pic_0 = loadImage('asset/in_arrow-0.png')
    in_pic_1 = loadImage('asset/in_arrow-1.png')
    in_pic_2 = loadImage('asset/in_arrow-2.png')
    in_pic_3 = loadImage('asset/in_arrow-3.png')

    out_pic_0 = loadImage('asset/out_arrow-0.png')
    out_pic_1 = loadImage('asset/out_arrow-1.png')
    out_pic_2 = loadImage('asset/out_arrow-2.png')
    out_pic_3 = loadImage('asset/out_arrow-3.png')
}

function setup() {
    if (!mapFlag) {
        return;
    }
    createCanvas(map_width, map_height)
}

function draw() {

    if (!mapFlag) {
        return
    }
    console.log("FUCK") // TODO: Remove this when done.
    // createCanvas(map_width, map_height)
    document.getElementById("header").style.visibility = "hidden"
    create_map()

    let portal;
    background(floor_colour_r, floor_colour_g, floor_colour_b)  // TODO: Change colour back when done.

    // Draw the main map.
    for (var i = 0; i < empty_location.length; i++) {
        // console.log(empty_location)
        // console.log(i, empty_location[i])
        square(empty_location[i][0], empty_location[i][1], canvas_scale)
    }

    let x_coord;
    let y_coord;

    // Iterate through the "in" portals.
    for (i = 0; i < current_in_floor_portals.length; i++) {
        x_coord = current_in_floor_portals[i]['X']
        y_coord = current_in_floor_portals[i]['Y']

        // Determines which picture of portal to use depending on orientation.
        switch(current_in_floor_portals[i]['Rotation']) {

            case 0:
                portal = in_pic_0;
                y_coord--
                break;

            case 1:
                portal = in_pic_1;
                x_coord++
                break;

            case 2:
                portal = in_pic_2;
                y_coord++
                break;

            case 3:
                portal = in_pic_3;
                x_coord--
                break;
        }
        // console.log(x_coord, y_coord)
        image(portal, canvas_scale * x_coord, canvas_scale * y_coord)
    }
    // Iterate through the "out" portals.
    for (i = 0; i < current_out_floor_portals.length; i++) {
        x_coord = current_out_floor_portals[i]['X'];
        y_coord = current_out_floor_portals[i]['Y'];

        // Determines which picture of portal to use depending on orientation.
        switch(current_out_floor_portals[i]['Rotation']) {

            case 0:
                portal = out_pic_0;
                y_coord--;
                break;

            case 1:
                portal = out_pic_1;
                x_coord++;
                break;

            case 2:
                portal = out_pic_2;
                y_coord++
                break;

            case 3:
                portal = out_pic_3;
                x_coord--
                break;
        }

        // console.log(x_coord, y_coord)

        image(portal, canvas_scale * x_coord, canvas_scale * y_coord)
    }
    if(position && position["World"] === floor_number)
    {
        console.log("level ", floor_number)
        square((position["x"])*canvas_scale, (map_y - position["y"])*canvas_scale, canvas_scale)
    }
}


// This function should get the map information and store them in various variables.
function create_map() {
    let render_location_x
    let render_location_y


    // Iterate through map matrix and draw map.
    for (var x = 0; x < map_x; x++) {
        for (var y = 0; y < map_y; y++) {


            // Get location of where square should be rendered.
            render_location_x = (canvas_scale * x)
            render_location_y = (canvas_scale * y)

                // If empty.
                if(!map_matrix[y][x])
                {
                    empty_location.push([render_location_x, render_location_y]);
                }

        }
    }
        current_in_floor_portals = []
        current_out_floor_portals = []
        for (let i = 0; i < portals_list.length; i++) {

        // Separate portals into "in" portals and "out" portals.
        // Collect all "in" portals corresponding to current floor.
        if (portals_list[i]["In"]["World"] === floor_number) {
            current_in_floor_portals.push(portals_list[i]["In"])
        }

        // Collect all "out" portals corresponding to current floor.
        if (portals_list[i]["Out"]["World"] === floor_number) {
            current_out_floor_portals.push(portals_list[i]["Out"])
        }
    }

}
