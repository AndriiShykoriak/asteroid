const ROIDS_VERT= 10;
const ROIDS_JAG =1;
const SHOW_BOUNDING = false;


//draw asteroid
function drawAsteroid() {
    let x, y, r, a, vert, offs;
    for (let i = 0; i < roidss.length; i++) {
        ctx.strokeStyle = "slategrey";
        ctx.lineWidth = SHIP_SIZE / 20;
        x = roidss[i].x;
        y = roidss[i].y;
        r = roidss[i].r;
        a = roidss[i].a;
        vert = roidss[i].vert;
        offs = roidss[i].offs;
        //draw path
        ctx.beginPath();
        ctx.moveTo(
            x + r * offs[0] * Math.cos(a),
            y + r * offs[0] * Math.sin(a)
        );
        //draw the polygon
        for (let j = 1; j < vert; j++) {
            ctx.lineTo(
                x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert),
            );
        }
        ctx.closePath();
        ctx.stroke();

        if (SHOW_BOUNDING) {
            ctx.strokeStyle = "lime";
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, false);
            ctx.stroke();
        }

    }
}
function newAsteroid(x,y,r) {
    let roid = {
        x:x,
        y:y,
        xv: Math.random() *50 /30 * (Math.random()< 0.5?1:-1),
        yv: Math.random() *50 /30 * (Math.random()< 0.5?1:-1),
        r:r,
        a: Math.random() * Math.PI * 2,
        vert: Math.floor(Math.random() * (ROIDS_VERT +1) + ROIDS_VERT /2),
        offs: []
    };
    for (let i=0; i<roid.vert; i++ ){
        roid.offs.push(Math.random()*ROIDS_JAG * 2+1 - ROIDS_JAG);
    }
    return roid;
}


function createAsteroidBelt() {
    roidss = [];
    let x,y;
    for (let i = 0; i<10; i++){
        do {
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        } while (distBetweenPoints(ship.x,ship.y,x,y)< 100*2 + ship.r);
        roidss.push(newAsteroid(x,y,Math.ceil(100/2)));
    }
}

function destroyAsteroid(index) {
    let x = roidss[index].x;
    let y = roidss[index].y;
    let r = roidss[index].r;

    // split the asteroid in two if necessary
    if(r == Math.ceil(100/2)){
        roidss.push(newAsteroid(x,y,Math.ceil(100/4)));
        roidss.push(newAsteroid(x,y,Math.ceil(100/4)));
    }else if(r == Math.ceil(100/4)){
        roidss.push(newAsteroid(x,y,Math.ceil(100/8)));
        roidss.push(newAsteroid(x,y,Math.ceil(100/8)));
    }
    // destroy the asteroid
    roidss.splice(index,1);
}

function distBetweenPoints(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2-y1,2));
}
//move the asteroid
function moveAsteroid() {


    for (let i = 0; i < roidss.length; i++) {
        roidss[i].x += roidss[i].xv;
        roidss[i].y += roidss[i].yv;

        //edge asteroids
        if (roidss[i].x < 0 - roidss[i].r) {
            roidss[i].x = canvas.width + roidss[i].r;
        } else if (roidss[i].x > canvas.width + roidss[i].r) {
            roidss[i].x = 0 - roidss[i].r
        }
        if (roidss[i].y < 0 - roidss[i].r) {
            roidss[i].y = canvas.height + roidss[i].r;
        } else if (roidss[i].y > canvas.height + roidss[i].r) {
            roidss[i].y = 0 - roidss[i].r
        }
    }

}

//check for asteroids collision
function collision() {
    let blinkOn = ship.blinkNum%2 == 0;
    let exploding = ship.explodeTime > 0;
    if (!exploding) {
        if (ship.blinkNum == 0) {
            for (let i = 0; i < roidss.length; i++) {
                if (distBetweenPoints(ship.x, ship.y, roidss[i].x, roidss[i].y) < ship.r + roidss[i].r) {
                    explodeShip();
                    destroyAsteroid(i);
                    break;
                }
            }
        }
        //draw rotate
        ship.a += ship.rot;
        //move the ship
        ship.x += ship.thrust.x;
        ship.y += ship.thrust.y;
    } else {
        ship.explodeTime--;
        if (ship.explodeTime == 0) {
            ship = newShip();
        }
    }
}

if(SHOW_BOUNDING){
    ctx.strokeStyle = "lime";
    ctx.beginPath();
    ctx.arc(ship.x,ship.y, ship.r,0,Math.PI *2,false );
    ctx.stroke();
}
