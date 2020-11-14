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
    [[0, 3, 4, 2], [0, 1, 1, 1]]
]
var placeholder_floor_number = 0

// Initialise image variables for portals.
let in_portal_0;
let in_portal_1;
let in_portal_2;
let in_portal_3;

let out_portal_0;
let out_portal_1;
let out_portal_2;
let out_portal_3;

var map_matrix = placeholder_map_matrix;
var floor_number = placeholder_floor_number; // Current floor number.
var map_width;
var map_height;
var canvas_scale = 100;
var portals_list = placeholder_portals;
var current_in_floor_portals = []; // List of "in" portals relating to current floor.
var current_out_floor_portals = []; // List of "out" portals relating to the current floor.

// This variable contains a list of where all of the empty spaces should be
// ie, the places that the player should be able to walk through.
var empty_location = [];

var map_x
var map_y

// Preloads the images for the portals. TODO: Finish this.
function preload() {
    in_portal_0 = loadImage('asset/in_arrow-0.png')
    out_portal_0 = loadImage('asset/out_arrow-0.png')
}

function setup() {
    createCanvas(map_width, map_height)
}

function draw() {
    background(255, 0, 0)  // TODO: Change colour back when done.

    // Draw the main map.
    for (var i = 0; i < empty_location.length; i++) {
        // console.log(empty_location)
        // console.log(i, empty_location[i])
        square(empty_location[i][0], empty_location[i][1], canvas_scale)
    }

    // Iterate through the "in" portals.
    for (i = 0; i < current_in_floor_portals.length; i++) {
        // console.log(current_in_floor_portals[1])
        image(in_portal_0, canvas_scale * current_in_floor_portals[i][1], canvas_scale * current_in_floor_portals[i][2])
    }
    // Iterate through the "out" portals.
    for (i = 0; i < current_out_floor_portals.length; i++) {
        image(out_portal_0, canvas_scale * current_out_floor_portals[i][1], canvas_scale * current_out_floor_portals[i][2])
    }
}


// This function should get the map information and store them in various variables.
function create_map() {
    let render_location_x
    let render_location_y

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

            switch (map_matrix[y][x]) {

                // If empty.
                case 0:
                    empty_location.push([render_location_x, render_location_y]);
                    break;

                // If wall.
                case 1:
                    break;
            }

        }
    }

    // Initialise information about the portals.
    // Iterate through the list of portals.
    for (let i = 0; i < portals_list.length; i++) {
        // TODO: Delete these console.logs.
        console.log("SHIT")

        // Separate portals into "in" portals and "out" portals.
        // Collect all "in" portals corresponding to current floor.
        if (portals_list[i][0][0] === floor_number) {
            current_in_floor_portals.push(portals_list[i][0])
        }

        // Collect all "out" portals corresponding to current floor.
        if (portals_list[i][1][0] === floor_number) {
            current_out_floor_portals.push(portals_list[i][1])
        }


    }

}
