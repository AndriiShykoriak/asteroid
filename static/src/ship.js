const SHIP_SIZE = 30;
const SHIP_BLINK_DUR = 0.1;
const SHIP_INV_DUR = 3;
const SHIP_EXPLODE_DUR = 0.3;
const SHOW_CENTRE_DOT =false;

function newShip() {
    return{
        x: canvas.width/2,
        y: canvas.height/2,
        r: SHIP_SIZE/2,
        a: 90/180 * Math.PI, //convert to radians
        blinkNum:Math.ceil(SHIP_INV_DUR/SHIP_BLINK_DUR),
        blinkTime:Math.ceil(SHIP_BLINK_DUR*30),
        canShoot: true,
        rot:0,
        explodeTime: 0,
        lasers: [],
        thrusting: false,
        thrust:{
            x: 0,
            y: 0,
        }
    }
}


function explodeShip() {
    ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * 30);
}

//thrust the ship
function thrustShip() {

    if (ship.thrusting) {
        ship.thrust.x += 5 * Math.cos(ship.a) / 30;
        ship.thrust.y -= 5 * Math.sin(ship.a) / 30;
    } else {
        ship.thrust.x -= 0.7 * ship.thrust.x / 30;
        ship.thrust.y -= 0.7 * ship.thrust.y / 30;
    }
}

//draw ship
function drawShip() {
    let blinkOn = ship.blinkNum%2 == 0;
    let exploding = ship.explodeTime > 0;
    if (!exploding) {
        if (blinkOn) {
            ctx.strokeStyle = "white";
            ctx.lineWidth = SHIP_SIZE / 20;
            ctx.beginPath();
            ctx.moveTo(
                ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
                ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
            );
            ctx.lineTo(
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a)),
            );
            ctx.lineTo(
                ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
                ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a)),
            );
            ctx.closePath();
            ctx.stroke();
        }
        //handle blinking
        if (ship.blinkNum > 0) {
            ship.blinkTime--;

            if (ship.blinkTime == 0) {
                ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * 30);
                ship.blinkNum--;
            }
        }
    } else {
        //draw the explosion
        ctx.fillStyle = "darkred";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
        ctx.fill();
    }
}
//edge ship
function edgeShip() {


    if (ship.x < 0 - ship.r) {
        ship.x = canvas.width + ship.r;
    } else if (ship.x > canvas.width + ship.r) {
        ship.x = 0 - ship.r;
    }
    if (ship.y < 0 - ship.r) {
        ship.y = canvas.height + ship.r;
    } else if (ship.y > canvas.height + ship.r) {
        ship.y = 0 - ship.r;
    }
}

//centre dot
if(SHOW_CENTRE_DOT){
    ctx.fillStyle = "red";
    ctx.fillRect(ship.x -1, ship.y - 1,2,2);
}


