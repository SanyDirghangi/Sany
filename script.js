const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let snake = [{ x: 160, y: 160 }];
let direction = 'RIGHT';
let food = generateFood();
let gameSpeed = 200;
let gameOver = false;
let growCounter = 0;

// Load sound effects
const moveSound = new Audio("move.mp3");
const eatSound = new Audio("eat.mp3");
const gameOverSound = new Audio("gameover.mp3");

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// Start the game when the button is clicked
document.getElementById("startButton").addEventListener("click", function () {
    resetGame();
    gameLoop();
    this.style.display = "none"; // Hide the start button
});

// Game loop
function gameLoop() {
    if (gameOver) {
        displayGameOver();
        return;
    }

    clearCanvas();
    moveSnake();
    checkCollisions();
    drawSnake();
    drawFood();
    displayScore();
    adjustSpeed();

    // Make the snake grow over time
    if (growCounter % 5 === 0) {
        snake.push({ ...snake[snake.length - 1] });
    }
    growCounter++;

    setTimeout(gameLoop, gameSpeed);
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

// Move snake
function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'LEFT': head.x -= gridSize; break;
        case 'RIGHT': head.x += gridSize; break;
        case 'UP': head.y -= gridSize; break;
        case 'DOWN': head.y += gridSize; break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = generateFood();
        playSound(eatSound);
    } else {
        snake.pop();
    }
}

// Check for collisions
function checkCollisions() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver = true;
        playSound(gameOverSound);
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            playSound(gameOverSound);
        }
    }
}

// Draw snake
function drawSnake() {
    ctx.fillStyle = "green";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
    }
}

// Generate new food
function generateFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

// Draw food
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Display score and high score
function displayScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    document.getElementById("score").textContent = `Score: ${score} | High Score: ${highScore}`;
}

// Reset game
function resetGame() {
    snake = [{ x: 160, y: 160 }];
    direction = 'RIGHT';
    score = 0;
    food = generateFood();
    gameSpeed = 200;
    gameOver = false;
    document.getElementById("startButton").style.display = "block"; // Show the start button again
}

// Adjust speed based on score
function adjustSpeed() {
    if (score % 50 === 0 && score > 0) {
        gameSpeed = Math.max(100, gameSpeed - 10);
    }
}

// Display game over screen
function displayGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(50, 125, 300, 150);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvasSize / 2, 170);
    ctx.font = "20px Arial";
    ctx.fillText("Press Enter to Restart", canvasSize / 2, 220);
}

// Handle keyboard input
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && gameOver) {
        resetGame();
        gameLoop();
    }

    if (!gameOver) {
        switch (event.key) {
            case "ArrowUp":
                if (direction !== 'DOWN') direction = 'UP';
                break;
            case "ArrowDown":
                if (direction !== 'UP') direction = 'DOWN';
                break;
            case "ArrowLeft":
                if (direction !== 'RIGHT') direction = 'LEFT';
                break;
            case "ArrowRight":
                if (direction !== 'LEFT') direction = 'RIGHT';
                break;
        }
        playSound(moveSound);
    }
});

// Touch controls for mobile
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;

canvas.addEventListener("touchstart", function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

canvas.addEventListener("touchend", function (event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
        else if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (dy > 0 && direction !== "UP") direction = "DOWN";
        else if (dy < 0 && direction !== "DOWN") direction = "UP";
    }
});

// Start the game
document.getElementById("startButton").style.display = "block"; // Show the button at the start
