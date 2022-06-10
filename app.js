const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 720;
const CANVAS_HEIGHT = canvas.height = 480;

const pigSpriteRight = new Image();
pigSpriteRight.src = "pig-right.png";
const pigSpriteLeft = new Image();
pigSpriteLeft.src = "pig-left.png";

const spriteWidth = 130;
const spriteHeight = 194;

let gameFrame = 0;
let canvasFrame = 0;
let staggerFrames = 10;


const playerState = {
    frameAction: "idle",
    direction: "right",
    
    movingRight: false,
    movingLeft: false,
    movingUp: false,
    movingDown: false,

    positionX: CANVAS_WIDTH / 2 - spriteWidth / 2,
    positionY: CANVAS_HEIGHT - spriteHeight*1.3,
    velocityX: 0,
    velocityY: 0,
    speed: 0.2,
}

class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener('keydown', (e) => {
            if (    e.key === 'ArrowDown' && this.keys.indexOf('ArrowUp') === -1 ||
                    e.key === 'ArrowUp' && this.keys.indexOf('ArrowDown') === -1 || 
                    e.key === 'ArrowLeft' && this.keys.indexOf('ArrowRight') === -1 ||
                    e.key === 'ArrowRight' && this.keys.indexOf('ArrowLeft') === -1
            ) {
                this.keys.indexOf(e.key) === -1 && this.keys.push(e.key);
            }
        })
        window.addEventListener('keyup', (e) => {
            if (    e.key === 'ArrowDown' && this.keys.indexOf('ArrowDown') != -1 ||
                    e.key === 'ArrowUp' && this.keys.indexOf('ArrowUp') != -1 ||
                    e.key === 'ArrowLeft' && this.keys.indexOf('ArrowLeft') != -1 ||
                    e.key === 'ArrowRight' && this.keys.indexOf('ArrowRight') != -1) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        })
    }
}

const spriteFrames = [];

const animationStates = [
    {
        name: "idle",
        frames: 2,
    },
    {
        name: "walk",
        frames: 4,
    },
];

let j = 0;
animationStates.forEach((state) => {
    let frames = [];
    for (let i = 0; i < state.frames; i++) {
        frames.push(j * spriteWidth);
        j++;
    }
    spriteFrames[state.name] = frames;
});

const input = new InputHandler();

const fondo = new Image();
fondo.src = "fondo.jpg";

function animate() {

    if (input.keys.length === 0) playerState.frameAction = "idle";
    playerState.movingRight = input.keys.includes("ArrowRight") ? true : false;
    playerState.movingLeft = input.keys.includes("ArrowLeft") ? true : false;
    playerState.movingUp = input.keys.includes("ArrowUp") ? true : false;
    playerState.movingDown = input.keys.includes("ArrowDown") ? true : false;

    if (input.keys.includes("ArrowRight")) playerState.direction = "right";
    if (input.keys.includes("ArrowLeft")) playerState.direction = "left";

    if (playerState.movingRight) {
        playerState.frameAction = "walk";
        playerState.velocityX += playerState.speed;
    } else if (playerState.movingLeft) {
        playerState.frameAction = "walk";
        playerState.velocityX -= playerState.speed;
    }

    if (playerState.movingUp) {
        playerState.frameAction = "walk";
        playerState.velocityY -= playerState.speed;
    } else if (playerState.movingDown) {
        playerState.frameAction = "walk";
        playerState.velocityY += playerState.speed;
    }

    playerState.positionX += playerState.velocityX;
    playerState.positionY += playerState.velocityY;

    playerState.velocityX *= 0.9;
    playerState.velocityY *= 0.9;

    if (playerState.positionX > CANVAS_WIDTH - spriteWidth + 30) {
        playerState.positionX = CANVAS_WIDTH - spriteWidth + 30;
    }
    
    if (playerState.positionX < -30) {
        playerState.positionX = -30;
    }

    if (playerState.positionY > CANVAS_HEIGHT - spriteHeight + 15) {
        playerState.positionY = CANVAS_HEIGHT - spriteHeight + 15;
    }

    if (playerState.positionY < CANVAS_HEIGHT - (spriteHeight + 110)) {
        playerState.positionY = CANVAS_HEIGHT - (spriteHeight + 110);
    }

    
    


    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (canvasFrame % staggerFrames === 0) {
        gameFrame++;
    }

    let position = gameFrame % spriteFrames[playerState.frameAction].length;
    let frameX = spriteFrames[playerState.frameAction][position]



    ctx.drawImage (
        fondo,
        // ! POSITION ON CANVAS!!!
        0, 0,
        CANVAS_WIDTH, CANVAS_HEIGHT
    );

    ctx.drawImage (
        (playerState.direction == "right") ? pigSpriteRight : pigSpriteLeft,
        frameX, 0, spriteWidth, spriteHeight,
        // ! POSITION ON CANVAS!!!
        playerState.positionX, playerState.positionY,
        spriteWidth, spriteHeight
    );

    if (input.keys.length > 0) console.log(input.keys);
    canvasFrame++;
    requestAnimationFrame(animate);

}

animate();
