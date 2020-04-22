const LASER_MAX = 10;
const LASER_SPD = 500;
const LASER_DIST = 0.6;

// draw the lasers
function drawLaser() {
    for (let i = 0; i < ship.lasers.length; i++) {
        ctx.fillStyle = "salmon";
        ctx.beginPath();
        ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
        ctx.fill();
    }
}
    function shootLaser() {
    //create laser
    if (ship.canShoot && ship.lasers.length < LASER_MAX){
        ship.lasers.push({
            x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
            y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
            xv: LASER_SPD * Math.cos(ship.a)/30,
            yv: LASER_SPD * Math.sin(ship.a)/30,
            dist:0
        });
    }
    //
    ship.canShoot = false;
}

//detect laser hits on asteroids

function hits() {
    let ax,ay,ar,lx,ly;
    for (let i = roidss.length - 1; i >= 0; i--) {
        //grab the asteroid properties
        ax = roidss[i].x;
        ay = roidss[i].y;
        ar = roidss[i].r;

        //loop over the lasers
        for (let j = ship.lasers.length - 1; j >= 0; j--) {

            //grab the laser properties
            lx = ship.lasers[j].x;
            ly = ship.lasers[j].y;

            // detect hits
            if (distBetweenPoints(ax, ay, lx, ly) < ar) {

                //remove the laser
                ship.lasers.splice(j, 1);

                //remove the asteroid
                //roids.splice(i,1);
                destroyAsteroid(i);
                break;
            }
        }
    }
}

//move the lasers
function moveToLasers() {


    for (let i = ship.lasers.length - 1; i >= 0; i--) {
        // check distance travelled
        if (ship.lasers[i].dist > LASER_DIST * canvas.width) {
            ship.lasers.splice(i, 1);
            continue;
        }
        //move the laser
        ship.lasers[i].x += ship.lasers[i].xv;
        ship.lasers[i].y -= ship.lasers[i].yv;

        //calculate the distance travelled
        ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));

        //HANDLE EDGE
        if (ship.lasers[i].x < 0) {
            ship.lasers[i].x = canvas.width;
        } else if (ship.lasers[i].x > canvas.width) {
            ship.lasers[i].x = 0;
        }
        if (ship.lasers[i].y < 0) {
            ship.lasers[i].y = canvas.height;
        } else if (ship.lasers[i].y > canvas.height) {
            ship.lasers[i].y = 0;
        }
    }
}