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
var placeholder_floor_number = 0



// Initialise image variables for portals.
let in_pic_0;
let in_pic_1;
let in_pic_2;
let in_pic_3;

let out_pic_0;
let out_pic_1;
let out_pic_2;
let out_pic_3;

var map_matrix;
var position;
var floor_number; // Current floor number.
var map_width;
var map_height;
var canvas_scale = 100;  // TODO: Fix scaling.
var portals_list;
var current_in_floor_portals = []; // List of "in" portals relating to current floor.
var current_out_floor_portals = []; // List of "out" portals relating to the current floor.

function parseJson(jsonData)
{
    if(jsonData.hasOwnProperty("Maps"))
    {
          floor_number = placeholder_floor_number; // TODO: Change this when available.
    map_matrix = jsonData["Maps"][0];
    portals_list = jsonData["Portals"];
    console.log(map_matrix)
    }
    else
    {
        position = jsonData;

    }
}

// Parsing JSON. TODO: Uncomment this when done.
e = new EventSource('http://192.168.1.171:8080/events/game');
e.onmessage = function(event) {
    console.log(event.data);
    console.log("PRICK")  // TODO: Remove this when done.
    var jsonData = JSON.parse(event.data);
    parseJson(jsonData)
};


//parseJson({"Maps":[[[true,false,true,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,true,false,true,false,true,false],[true,false,true,false,true,false,true,false,false,true,false,true,false]],[[true,false,true,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,true,false,true,false,true,false],[true,false,true,false,true,false,true,false,false,true,false,true,false]],[[true,false,true,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,false,true,false,true,false,true],[true,false,true,false,true,false,true,true,false,true,false,true,false],[true,false,true,false,true,false,true,false,false,true,false,true,false]]],"Portals":[{"In":{"World":1,"X":0,"Y":1,"Rotation":1},"Out":{"World":1,"X":0,"Y":4,"Rotation":0}},{"In":{"World":5,"X":6,"Y":7,"Rotation":1},"Out":{"World":4,"X":5,"Y":6,"Rotation":7}}]})

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
    createCanvas(map_width, map_height)
}

function draw() {
    createCanvas(map_width, map_height)
    create_map()

    let portal;
    background(255, 0, 0)  // TODO: Change colour back when done.

    // Draw the main map.
    for (var i = 0; i < empty_location.length; i++) {
        // console.log(empty_location)
        // console.log(i, empty_location[i])
        square(empty_location[i][0], empty_location[i][1], canvas_scale)
    }

    // Iterate through the "in" portals.
    for (i = 0; i < current_in_floor_portals.length; i++) {
        // Determines which picture of portal to use depending on orientation.
        switch(current_in_floor_portals[i]['Rotation']) {

            case 0:
                portal = in_pic_0;
                break;

            case 1:
                portal = in_pic_1;
                break;

            case 2:
                portal = in_pic_2;
                break;

            case 3:
                portal = in_pic_3;
                break;
        }

        image(portal, canvas_scale * current_in_floor_portals[i]['X'], canvas_scale * current_in_floor_portals[i]['Y'])
    }
    // Iterate through the "out" portals.
    for (i = 0; i < current_out_floor_portals.length; i++) {
        // Determines which picture of portal to use depending on orientation.
        switch(current_out_floor_portals[i]['Rotation']) {

            case 0:
                portal = out_pic_0;
                break;

            case 1:
                portal = out_pic_1;
                break;

            case 2:
                portal = out_pic_2;
                break;

            case 3:
                portal = out_pic_3;
                break;
        }

        image(portal, canvas_scale * current_out_floor_portals[i]['X'], canvas_scale * current_out_floor_portals[i]['Y'])
    }
    if(position)
    {
        var size = 0.02;
        square((position["x"]+size)*canvas_scale, (position["y"]+size)*canvas_scale, canvas_scale)
    }
}


// This function should get the map information and store them in various variables.
function create_map() {
    let render_location_x
    let render_location_y

    if(map_matrix == undefined || map_matrix[0].length == 0) return;


    // Set size of the canvas.
    map_x = map_matrix[0].length
    map_y = map_matrix.length

    // Scale the map on the screen.
    map_width = canvas_scale * map_x
    map_height = canvas_scale * map_y


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

    // // Initialise information about the portals.
    // // Iterate through the list of portals.
    // for (let i = 0; i < portals_list.length; i++) {
    //     // TODO: Delete these console.logs.
    //     console.log("SHIT")
    //
    //     // Separate portals into "in" portals and "out" portals.
    //     // Collect all "in" portals corresponding to current floor.
    //     if (portals_list[i][0][0] === floor_number) {
    //         current_in_floor_portals.push(portals_list[i][0])
    //     }
    //
    //     // Collect all "out" portals corresponding to current floor.
    //     if (portals_list[i][1][0] === floor_number) {
    //         current_out_floor_portals.push(portals_list[i][1])
    //     }
    // }

        for (let i = 0; i < portals_list.length; i++) {
        // TODO: Delete these console.logs.
        // TODO: Fix portals properly.
        console.log("SHIT")

        // Separate portals into "in" portals and "out" portals.
        // Collect all "in" portals corresponding to current floor.
        //if (portals_list[i]["In"][0] === floor_number) {
            current_in_floor_portals.push(portals_list[i]["In"])
        //}

        // Collect all "out" portals corresponding to current floor.
        //if (portals_list[i]["Out"][0] === floor_number) {
            current_out_floor_portals.push(portals_list[i]["Out"])
        //}
    }

}
