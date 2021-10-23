// Get the tile coordinate
function getTileCoordinate(column, row) {
    var tilex = column * tilewidth;
 
    // X offset for odd rows
    if (row % 2) {
        tilex += tilewidth/2;
    }
 
    var tiley = row * tileheight;
    return { tilex: tilex, tiley: tiley };
}
function renderTiles() {
    // Top to bottom
    for (var j=0; j<rows; j++) {
        for (var i=0; i<columns; i++) {
            // Get the tile
            var tile = tilearray[i][j];
 
            // Calculate the tile coordinates
            var coord = getTileCoordinate(i, j);
 
            // Draw the tile
            drawTile(coord.tilex, coord.tiley, tile.type);
        }
    }
}
function getTileCoordinate(column, row) {
    var tilex = column * tilewidth;
 
    // X offset for odd or even rows
    if ((row + rowoffset) % 2) {
        tilex += tilewidth/2;
    }
 
    var tiley = row * rowheight;
    return { tilex: tilex, tiley: tiley };
}
// Get the closest grid position
function getGridPosition(x, y) {
    var gridy = Math.floor(y / rowheight);
 
    // Check for offset
    var xoffset = 0;
    if ((gridy + rowoffset) % 2) {
        xoffset = tilewidth / 2;
    }
    var gridx = Math.floor((x - xoffset) / tilewidth);
 
    return { x: gridx, y: gridy };
}
var centerx = bubble.x + tilewidth/2;
    var centery = bubble.y + tileheight/2;
    var gridpos = getGridPosition(centerx, centery);
 
    // Access the tilearray at the calculated index
    if (tilearray[gridpos.x][gridpos.y].type != -1) {
        // (...)
    }
    function radToDeg(angle) {
        return angle * (180 / Math.PI);
    }
     
    // On mouse movement
    function onMouseMove(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);
     
        // Get the mouse angle
        var mouseangle = radToDeg(Math.atan2((player.y+tileheight/2) - pos.y, pos.x - (player.x+tilewidth/2)));
     
        // Convert range to 0, 360 degrees
        if (mouseangle < 0) {
            mouseangle = 180 + (180 + mouseangle);
        }
     
        // (...)
     
        // Set the player angle
        player.angle = mouseangle;
    }
    var lbound = 8;
    var ubound = 172;
    if (mouseangle > 90 && mouseangle < 270) {
        // Left
        if (mouseangle > ubound) {
            mouseangle = ubound;
        }
    } else {
        // Right
        if (mouseangle < lbound || mouseangle >= 270) {
            mouseangle = lbound;
        }
    }


    function degToRad(angle) {
        return angle * (Math.PI / 180);
    }
     
    // Render the angle of the mouse
    function renderMouseAngle() {
        var centerx = player.x + tilewidth/2;
        var centery = player.y + tileheight/2;
     
        // Draw the angle
        context.lineWidth = 2;
        context.strokeStyle = "#0000ff";
        context.beginPath();
        context.moveTo(centerx, centery);
        context.lineTo(centerx + 1.5*tilewidth * Math.cos(degToRad(player.angle)),
                       centery - 1.5*tileheight * Math.sin(degToRad(player.angle)));
        context.stroke();
    }

    function stateShootBubble(dt) {
 
        // Move the bubble in the direction of the mouse
        bubble.x += dt * bubble.speed * Math.cos(degToRad(bubble.angle));
        bubble.y += dt * bubble.speed * -1*Math.sin(degToRad(bubble.angle));
     
        // (...)
    }
// Handle left and right collisions with the level
if (bubble.x <= level.x) {
    // Left edge
    bubble.angle = 180 - bubble.angle;
    bubble.x = level.x;
} else if (bubble.x + tilewidth >= level.x + level.width) {
    // Right edge
    bubble.angle = 180 - bubble.angle;
    bubble.x = level.x + level.width - tilewidth;
}

// Collisions with the top of the level
if (bubble.y <= level.y) {
    // Top collision
    bubble.y = level.y;
    snapBubble();
    return;
}
    // Collisions with other tiles
    for (var i=0; i<level.columns; i++) {
        for (var j=0; j<level.rows; j++) {
            var tile = level.tiles[i][j];
 
            // Skip empty tiles
            if (tile.type < 0) {
                continue;
            }
 
            // Check for intersections
            var coord = getTileCoordinate(i, j);
            if (circleIntersection(bubble.x + tilewidth/2,
                                   bubble.y + tileheight/2,
                                   level.radius,
                                   coord.tilex + tilewidth/2,
                                   coord.tiley + tileheight/2,
                                   level.radius)) {
 
                // Intersection with a level bubble
                snapBubble();
                return;
            }
        }
    }

// Check if two circles intersect
function circleIntersection(x1, y1, r1, x2, y2, r2) {
    // Calculate the distance between the centers
    var dx = x1 - x2;
    var dy = y1 - y2;
    var len = Math.sqrt(dx * dx + dy * dy);
 
    if (len < r1 + r2) {
        // Circles intersect
        return true;
    }
 
    return false;
}
function snapBubble() {
    // Get the grid position
    var centerx = bubble.x + tilewidth/2;
    var centery = bubble.y + tileheight/2;
    var gridpos = getGridPosition(centerx, centery);

    // Make sure the grid position is valid
    // (...)

    // Add the tile to the grid
    level.tiles[gridpos.x][gridpos.y].type = bubble.tiletype;

    // Check for game over
    // Find and remove clusters
    // Add a row of bubbles after a number of turns
    // Next bubble
    // (...)
}

// Find cluster at the specified tile location
function findCluster(tx, ty, matchtype, reset, skipremoved) {
    // Reset the processed flags
    if (reset) {
        resetProcessed();
    }
 
    // Get the target tile. Tile coord must be valid.
    var targettile = level.tiles[tx][ty];
 
    // Initialize the toprocess array with the specified tile
    var toprocess = [targettile];
    targettile.processed = true;
    var foundcluster = [];
 
    while (toprocess.length > 0) {
        // Pop the last element from the array
        var currenttile = toprocess.pop();
 
        // Skip processed and empty tiles
        if (currenttile.type == -1) {
            continue;
        }
 
        // Skip tiles with the removed flag
        if (skipremoved && currenttile.removed) {
            continue;
        }
 
        // Check if current tile has the right type, if matchtype is true
        if (!matchtype || (currenttile.type == targettile.type)) {
            // Add current tile to the cluster
            foundcluster.push(currenttile);
 
            // Get the neighbors of the current tile
            var neighbors = getNeighbors(currenttile);
 
            // Check the type of each neighbor
            for (var i=0; i<neighbors.length; i++) {
                if (!neighbors[i].processed) {
                    // Add the neighbor to the toprocess array
                    toprocess.push(neighbors[i]);
                    neighbors[i].processed = true;
                }
            }
        }
    }
 
    // Return the found cluster
    return foundcluster;
}

function resetProcessed(){
    for (var i=0; i<level.columns; i++) {
        for (var j=0; j<level.rows; j++) {
            level.tiles[i][j].processed = false;
        }
    }
}

 
// Neighbor offset table
var neighborsoffsets = [[[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]], // Even row tiles
                        [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]];  // Odd row tiles
 
// Get the neighbors of the specified tile
function getNeighbors(tile) {
    var tilerow = (tile.y + rowoffset) % 2; // Even or odd row
    var neighbors = [];
 
    // Get the neighbor offsets for the specified tile
    var n = neighborsoffsets[tilerow];
 
    // Get the neighbors
    for (var i=0; i<n.length; i++) {
        // Neighbor coordinate
        var nx = tile.x + n[i][0];
        var ny = tile.y + n[i][1];
 
        // Make sure the tile is valid
        if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
            neighbors.push(level.tiles[nx][ny]);
        }
    }

 
    return neighbors;
}
cluster = findCluster(gridpos.x, gridpos.y, true, true, false);
// Find floating clusters
function findFloatingClusters() {
    // Reset the processed flags
    resetProcessed();
 
    var foundclusters = [];
 
    // Check all tiles
    for (var i=0; i<level.columns; i++) {
        for (var j=0; j<level.rows; j++) {
            var tile = level.tiles[i][j];
            if (!tile.processed) {
                // Find all attached tiles
                var foundcluster = findCluster(i, j, false, false, true);
 
                // There must be a tile in the cluster
                if (foundcluster.length <= 0) {
                    continue;
                }
 
                // Check if the cluster is floating
                var floating = true;
                for (var k=0; k<foundcluster.length; k++) {
                    if (foundcluster[k].y == 0) {
                        // Tile is attached to the roof
                        floating = false;
                        break;
                    }
                }
 
                if (floating) {
                    // Found a floating cluster
                    foundclusters.push(foundcluster);
                }
            }
        }
    }
 
    return foundclusters;
}
function addBubbles() {
    // Move the rows downwards
    for (var i=0; i<level.columns; i++) {
        for (var j=0; j<level.rows-1; j++) {
            level.tiles[i][level.rows-1-j].type = level.tiles[i][level.rows-1-j-1].type;
        }
    }
 
    // Add a new row of bubbles at the top
    for (var i=0; i<level.columns; i++) {
        // Add random, existing, colors
        level.tiles[i][0].type = getExistingColor();
    }

}
var bubblecolors = 7;
 
// Get a random int between low and high, inclusive
function randRange(low, high) {
    return Math.floor(low + Math.random()*(high-low+1));
}
 
// Get a random existing color
function getExistingColor() {
    existingcolors = findColors();
 
    var bubbletype = 0;
    if (existingcolors.length > 0) {
        bubbletype = existingcolors[randRange(0, existingcolors.length-1)];
    }
 
    return bubbletype;
}
 
// Find the remaining colors
function findColors() {
    var foundcolors = [];
    var colortable = [];
    for (var i=0; i<bubblecolors; i++) {
        colortable.push(false);
    }
 
    // Check all tiles
    for (var i=0; i<level.columns; i++) {
        for (var j=0; j<level.rows; j++) {
            var tile = level.tiles[i][j];
            if (tile.type >= 0) {
                if (!colortable[tile.type]) {
                    colortable[tile.type] = true;
                    foundcolors.push(tile.type);
                }
            }
        }
    }
 
    return foundcolors;
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14

	

function checkGameOver() {
    // Check for game over
    for (var i=0; i<level.columns; i++) {
        // Check if there are bubbles in the bottom row
        if (level.tiles[i][level.rows-1].type != -1) {
            // Game over
            nextBubble();
            setGameState(gamestates.gameover);
            return true;
        }
    }
 
    return false;
}

