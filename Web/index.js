// TODO: PLACEHOLDERS
var placeholder_map_width = 700
var placeholder_map_height = 800
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

var map_matrix = placeholder_map_matrix;
var map_width = placeholder_map_width;
var map_height = placeholder_map_height;
var canvas_scale = 100;

// This variable contains a list of where all of the empty spaces should be
// ie, the places that the player should be able to walk through.
var empty_location = [];

var map_x
var map_y

function setup() {
    createCanvas(map_width, map_height)
}

function draw() {
    background(0, 0, 0)


    for (var i = 0; i < empty_location.length; i++) {
        // console.log(empty_location)
        // console.log(i, empty_location[i])
        square(empty_location[i][0], empty_location[i][1], canvas_scale)
    }
    // square(30, 20, 55)
}


// This function should get the map information and store them in various variables.
function create_map() {
    let render_location_x
    let render_location_y

    // Set size of the canvas.
    map_x = map_matrix.length
    map_y = map_matrix[0].length

    map_width = canvas_scale * map_y
    map_height = canvas_scale * map_x

    // TODO: Remove logs below when done.
    console.log("PRICK")

    console.log(map_width)
    console.log(map_height)

    console.log("CUNT")

    // Iterate through map matrix and draw map.
    // TODO: Fix bug here: Keeps rendering an extra line at the bottom.
    for (var x = 0; x < map_x; x++) {
        for (var y = 0; y < map_y; y++) {

            // TODO: Delete these console.log
            console.log(y, x)
            console.log(map_matrix[y][x])

            // Get location of where square should be rendered.
            render_location_x = (canvas_scale * x)
            render_location_y = (canvas_scale * y)

            switch (map_matrix[y][x]) {

                // If empty.
                case 0:
                    empty_location.push([render_location_x, render_location_y])
                    break;

                // If wall.
                case 1:
                    break;
            }

        }
    }

}
