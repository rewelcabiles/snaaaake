import {BOARD_SIZE} from "@/config";

export const tileSize = 24;

export const TILEMAP = {
  EMPTY: 0,
  WALL: 1,
  SNAKE: 2,
  SNAKE_BODY: 3,
  APPLE: 4,
};

export function draw(gameCanvas, game) {
  let ctx = gameCanvas.value.getContext("2d");
  ctx.clearRect(0, 0, BOARD_SIZE * tileSize, BOARD_SIZE * tileSize);
  drawBGTiles(ctx, game);
  drawSnake(ctx, game);
  drawApple(ctx, game);
}

function drawBGTiles(ctx, game) {
  for (const index of Array(BOARD_SIZE * BOARD_SIZE).keys()) {
    let coordinate = game.convert1Dto2D(index);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#f0f3f4";
    ctx.strokeRect(
      tileSize * coordinate[0],
      tileSize * coordinate[1],
      tileSize,
      tileSize
    );
  }
}

function drawSnake(ctx, game) {
  // Snake Head
  ctx.fillStyle = "rgb(255, 15, 190)";
  ctx.fillRect(
    game.snake.x * tileSize,
    game.snake.y * tileSize,
    tileSize,
    tileSize
  );

  // Snake body
  for (let section of game.snake.history) {
    ctx.fillStyle = "rgb(190, 250, 15)";
    ctx.fillRect(
      section[0] * tileSize,
      section[1] * tileSize,
      tileSize,
      tileSize
    );
  }
}

function drawApple(ctx, game) {
  if (game.apple === null) {
    return;
  }
  ctx.fillStyle = "rgb(255, 100, 0)";
  ctx.fillRect(
    game.apple[0] * tileSize,
    game.apple[1] * tileSize,
    tileSize,
    tileSize
  );
}
