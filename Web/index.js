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

var map_matrix = placeholder_map_matrix
var map_width = placeholder_map_width;
var map_height = placeholder_map_height;

var map_x
var map_y

function setup() {
    createCanvas(map_width, map_height)
}

function draw() {
    background(0, 0, 0)
    ellipse(50, 50, 80, 80)
    square(30, 20, 55)
}

function create_map() {

    // Set size of the canvas.
    map_x = map_matrix.length
    map_y = map_matrix[0].length

    map_width = 100 * map_y
    map_height = 100 * map_x

    console.log("PRICK")

    console.log(map_width)
    console.log(map_height)

    console.log("CUNT")

    // Iterate through map matrix and draw map.
    for (var x = 0; x < map_x; x++) {
        for (var y = 0; y < map_y; y ++) {

            // TODO: Delete these console.log
            console.log(y, x)
            console.log(map_matrix[y][x])
        }
    }

}
