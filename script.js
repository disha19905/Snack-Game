// Sounds
const bgMusic = new Audio('background.mp3');
const eatSound = new Audio('eat.mp3');
const restartBtn = document.getElementById('restartBtn');
const pauseBtn = document.getElementById('pauseBtn'); // Added pause button

// Snake color - Dark Green
const snakeColor = '#228B22'; // Dark Green for snake

// Food color - Dark Red
const foodColor = '#FF6347'; // Dark Red for food

bgMusic.loop = true;
bgMusic.volume = 0.3;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // Size of each grid cell
const canvasSize = 400; // Canvas size
let snake = [{ x: 160, y: 200 }];
let direction = 'RIGHT';
let food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
    color: foodColor
};
let score = 0;

// Music flag to prevent autoplay issues
let musicStarted = false;

// Pause flag
let isPaused = false;

function drawGrid() {
    // Draw a grid on the canvas
    ctx.strokeStyle = '#444'; // Grid color
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvasSize; x += box) {
        for (let y = 0; y < canvasSize; y += box) {
            ctx.strokeRect(x, y, box, box); // Draw each grid cell
        }
    }
}

function drawEyes(x, y) {
    // Draw the two eyes on the snake head
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 4, y + 4, 4, 0, Math.PI * 2);  // Left eye
    ctx.arc(x + 4, y + 4, 4, 0, Math.PI * 2);  // Right eye
    ctx.fill();

    // Draw the pupils of the eyes (black circles)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 4, y + 4, 2, 0, Math.PI * 2);  // Left pupil
    ctx.arc(x + 4, y + 4, 2, 0, Math.PI * 2);  // Right pupil
    ctx.fill();
}

function draw() {
    if (isPaused) return; // If paused, skip drawing

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    drawGrid(); // Draw the grid on the canvas

    // Draw Snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    drawEyes(snake[0].x + 10, snake[0].y + 10);

    // Draw Food
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, box, box);

    // Snake Movement
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Wrap snake around borders
    if (snakeX < 0) snakeX = canvasSize - box;
    if (snakeX >= canvasSize) snakeX = 0;
    if (snakeY < 0) snakeY = canvasSize - box;
    if (snakeY >= canvasSize) snakeY = 0;

    // Eat food
    if (snakeX === food.x && snakeY === food.y) {
        eatSound.play();
        score++;
        increaseSpeed();
        document.getElementById('score').innerText = "Score: " + score;

        // Update the page title with the score
        document.title = `Snake Game 🐍 | Score: ${score}`;

        food = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box,
            color: foodColor
        };
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    // Check for collision with itself
    if (collision(newHead, snake)) {
        clearInterval(game);
        bgMusic.pause();
        restartBtn.style.display = 'block';
        document.getElementById('score').innerText = "Game Over! Score: " + score;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Initial speed
let gameSpeed = 150;
let game; // Don't start the game immediately!

function startGame(level) {
    let speed;
    if (level === 'easy') speed = 200;
    else if (level === 'medium') speed = 120;
    else if (level === 'hard') speed = 80;

    gameSpeed = speed;
    game = setInterval(draw, gameSpeed);

    // Hide level menu and show game
    document.getElementById('levelMenu').style.display = 'none';
    bgMusic.play(); // Start background music
    musicStarted = true;
}
// Increase speed as score increases
function increaseSpeed() {
    clearInterval(game);
    gameSpeed = Math.max(150 - Math.floor(score / 2), 50);
    game = setInterval(draw, gameSpeed);
}

restartBtn.addEventListener('click', () => {
    location.reload();
});

// Pause button functionality
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.innerText = isPaused ? 'Resume' : 'Pause';
});

// Play music when the user first interacts (key press)
document.addEventListener('keydown', () => {
    if (!musicStarted) {
        bgMusic.play();
        musicStarted = true;
    }
});

// Capture the key presses for controlling the snake
document.addEventListener('keydown', function (event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    else if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
});
const endGameBtn = document.getElementById('endGameBtn');

endGameBtn.addEventListener('click', () => {
    clearInterval(game); // Stop the snake movement
    bgMusic.pause();     // Pause background music
    isPaused = true;     // Make sure game is truly paused
    document.getElementById('score').innerText = "Game Ended! Final Score: " + score;

    // Hide Pause and End Game buttons after ending
    pauseBtn.style.display = 'none';
    endGameBtn.style.display = 'none';
});
