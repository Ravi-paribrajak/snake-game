
// Defining variables
let inputDir = { x: 0, y: 0 };
let speed = 4;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
food = { x: 6, y: 7 };
let hiscoreval;

// Add these variables at the top
let isPaused = false;
const pausePlayBtn = document.getElementById('pausePlayBtn');

// This function will call  gameEngine() function repeatedly to refresh the game:-
// Modify main function to handle pause
function main(ctime) {
    window.requestAnimationFrame(main);
    if (isPaused) return;
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}
// Collision Detection:-
function isCollide(snake) {

    // If snake bumps it's own head into it's own body:-
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If snake hits the wall:-
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

// Writing maing logic gameEngine():-
function gameEngine() {

    if (isCollide(snakeArr)) {
        inputDir = { x: 0, y: 0 };   // Resetting input direction after collision
        // alert("Game over, press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];  // Resetting snake position after collission
        score = 0; // Resetting score value as game is overed!
        return;
    }
    // Food consumption logic:-
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        score += 100; // Updating score

        // Updating high-score:-
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "Highscore: " + hiscoreval;
        }
        // Updating scoreBox:-
        scoreBox.innerHTML = "score: " + score;

        // Increasing snake length after every food consumption:-
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        food = { x: Math.round(2 + (16 - 2) * Math.random()), y: Math.round(2 + (16 - 2) * Math.random()) };
    }

    // Moving the snake forward:-
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Displaying the snake:-
    board.innerHTML = ""; // Emptying the board
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        // Differntiating the snake head from it's body:-
        if (index === 0) {
            snakeElement.classList.add('head');    // Adding head class to snakeElement
        }
        else {
            snakeElement.classList.add('snake');   // Adding snake class to snakeElement
        }
        board.appendChild(snakeElement);
    });

    // Displaying the food:-
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;

    foodElement.classList.add('food');  // Adding food class to foodElement
    board.appendChild(foodElement);
}

// Maing logic starts here:-
let hiscore = localStorage.getItem('highscore');

if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("highscore: ", JSON.stringify(hiscoreval));
}
else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "Highscore: " + hiscore;
}

window.requestAnimationFrame(main);

// Handling user input using arrow keys:-
window.addEventListener('keydown', (e) => {

    if(isPaused){
        return;
    }
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) {  // Prevent going down if moving up
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) {  // Prevent going up if moving down
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) {  // Prevent going right if moving left
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) {  // Prevent going left if moving right
                inputDir.x = 1;
                inputDir.y = 0;
            }
            break;
    }
});


// Handling user input using touch:-
window.addEventListener('touchend', (e) => {
    if(isPaused){
        return;
    }
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let diffX = endX - startX;
    let diffY = endY - startY;

    // Determine the swipe direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && inputDir.x !== -1) {  // Swipe Right, but not when moving left
            inputDir.x = 1;
            inputDir.y = 0;
        } else if (diffX < 0 && inputDir.x !== 1) {  // Swipe Left, but not when moving right
            inputDir.x = -1;
            inputDir.y = 0;
        }
    } else {
        // Vertical swipe
        if (diffY > 0 && inputDir.y !== -1) {  // Swipe Down, but not when moving up
            inputDir.x = 0;
            inputDir.y = 1;
        } else if (diffY < 0 && inputDir.y !== 1) {  // Swipe Up, but not when moving down
            inputDir.x = 0;
            inputDir.y = -1;
        }
    }
    // moveSound.play();
});


// Add event listeners for new buttons at the bottom
document.getElementById('speedUpBtn').addEventListener('click', () => {
    if (speed < 20) speed++;
});

document.getElementById('speedDownBtn').addEventListener('click', () => {
    if (speed > 1) speed--;
});

pausePlayBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pausePlayBtn.textContent = isPaused ? 'Play' : 'Pause';
});

document.getElementById('newGameBtn').addEventListener('click', () => {
    // Reset game state
    snakeArr = [{ x: 13, y: 15 }];
    inputDir = { x: 0, y: 0 };
    score = 0;
    speed = 4;
    isPaused = false;
    pausePlayBtn.textContent = 'Pause';
    scoreBox.innerHTML = "Score: " + score;
    food = {
        x: Math.round(2 + (16 - 2) * Math.random()),
        y: Math.round(2 + (16 - 2) * Math.random())
    };
});