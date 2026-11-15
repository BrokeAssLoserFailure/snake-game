// ─── Configuration ───────────────────────────────────────────
const CELL_SIZE = 20;
const TICK_MS = 150;
const COLORS = {
  background: "#000",
  snake: "#2ecc71",
  food: "#e74c3c",
  overlay: "rgba(0, 0, 0, 0.75)",
  text: "#fff",
};

// ─── DOM References ──────────────────────────────────────────
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

// ─── Derived Constants ───────────────────────────────────────
const COLS = canvas.width / CELL_SIZE;
const ROWS = canvas.height / CELL_SIZE;

// ─── Game State ──────────────────────────────────────────────
let snake;
let direction;
let nextDirection;
let food;
let score;
let gameOver;

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  gameOver = false;
  scoreEl.textContent = "0";
  placeFood();
}

// ─── Food Placement ──────────────────────────────────────────
function placeFood() {
  let candidate;
  do {
    candidate = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (
    snake.some(
      (segment) => segment.x === candidate.x && segment.y === candidate.y,
    )
  );
  food = candidate;
}

// ─── Input ───────────────────────────────────────────────────
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key === "ArrowUp" && direction.y === 0) nextDirection = { x: 0, y: -1 };
  if (key === "ArrowDown" && direction.y === 0) nextDirection = { x: 0, y: 1 };
  if (key === "ArrowLeft" && direction.x === 0) nextDirection = { x: -1, y: 0 };
  if (key === "ArrowRight" && direction.x === 0) nextDirection = { x: 1, y: 0 };
});

// ─── Update ──────────────────────────────────────────────────
function update() {
  if (gameOver) return;

  direction = nextDirection;

  const head = snake[0];
  const newHead = { x: head.x + direction.x, y: head.y + direction.y };

  const hitsWall =
    newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS;
  const hitsSelf = snake.some(
    (segment) => segment.x === newHead.x && segment.y === newHead.y,
  );

  if (hitsWall || hitsSelf) {
    gameOver = true;
    return;
  }

  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    scoreEl.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}

// ─── Render ──────────────────────────────────────────────────
function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function draw() {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawCell(food.x, food.y, COLORS.food);
  snake.forEach((segment) => drawCell(segment.x, segment.y, COLORS.snake));

  if (gameOver) {
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLORS.text;
    ctx.textAlign = "center";
    ctx.font = "bold 30px system-ui, sans-serif";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText(
      "Refresh to play again",
      canvas.width / 2,
      canvas.height / 2 + 30,
    );
  }
}

// ─── Main Loop ───────────────────────────────────────────────
function tick() {
  update();
  draw();
}

// ─── Start ───────────────────────────────────────────────────
resetGame();
setInterval(tick, TICK_MS);
