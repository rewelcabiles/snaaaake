import { Population } from "@/model";
import { DIRECTION, BOARD_SIZE, TILEMAP } from "@/config";
import {draw} from "@/canvas";

export class GameManager {
  constructor() {
    this.population = new Population();
    this.game = null;
    this.simRunning = true;
  }

  toggleSimRunning() {
    this.simRunning = !this.simRunning;
  }

  async runSim (canvas) {
    for (const snake of this.population.population) {
      this.game = new Game(snake, this.population);
      await this.game.gameLoop(draw, canvas);
    }
  }

  endGame() {

  }

  getCurrentGameInfo () {
    if (!this.game) {
      return {
        "Simulation Running": this.simRunning,
        "Apple Coords": "N/A",
        "Seconds Per Step": "N/A",
        "Snake Coordinates": "N/A",
      };
    }
    return {
      "Simulation Running": this.simRunning,
      "Apple Coords": this.game.apple,
      "Seconds Per Step": this.game.gameSpeed,
      "Snake Coordinates": String(this.game.snake.x) + ", " + String(game.snake.y),
    };
  }
}

export class Game {
  constructor(model, pop) {
    this.size = BOARD_SIZE;
    this.gameSpeed = 250;
    this.running = true;
    this.apple = null;
    this.createFood();
    this.model = model;
    this.population = pop;
    this.snake = new Snake();
    this.canStep = true;
    this.boardState = new Array(BOARD_SIZE)
      .fill(0)
      .map(() => new Array(BOARD_SIZE).fill(0));
    for (let i = 0; i < BOARD_SIZE; i++) {
      this.boardState[i][0] = TILEMAP.WALL; // Setting the leftmost column
      this.boardState[i][BOARD_SIZE - 1] = TILEMAP.WALL; // Setting the rightmost column
      this.boardState[0][i] = TILEMAP.WALL; // Setting the topmost row
      this.boardState[BOARD_SIZE - 1][i] = TILEMAP.WALL; // Setting the bottommost row
    }
  }

  async gameLoop(draw, canvas) {
    while (this.running) {
      await new Promise(r => setTimeout(r, 150));
      if (!this.step()) {
        this.running = false;
      }
      draw(canvas, this);
    }
    return this.applesEaten;
  }

  step() {
    const dir = this.population.predict(this.model, this.boardState);
    let snake_dir = Object.keys(DIRECTION)[dir];
    this.snake.queueChangeDirection(snake_dir);
    this.snake.move();

    // Did snake eat food
    if (this.snake.x === this.apple[0] && this.snake.y === this.apple[1]) {
      this.createFood();
      this.snake.maxLength += 1;
      this.applesEaten += 1;
    }

    // Did snake hit wall
    if (this.snake.x >= this.size || this.snake.x <= 0) {
      return false;
    } else if (this.snake.y >= this.size || this.snake.y <= 0) {
      return false;
    }
    //Did snake hit itself
    for (let section of this.snake.history) {
      if (section[0] === this.snake.x && section[1] === this.snake.y) {
        return false;
      }
    }
    this.updateBoardState();
    return true;
  }
  convert1Dto2D(index) {
    return [Math.floor(index / this.size), index % this.size];
  }

  createFood() {
    let xRand = Math.floor(Math.random() * this.size);
    let yRand = Math.floor(Math.random() * this.size);
    this.apple = [xRand, yRand];
  }

  updateBoardState() {
    this.boardState[this.apple[0]][this.apple[1]] = TILEMAP.APPLE;
    this.boardState[this.snake.x][this.snake.y] = TILEMAP.SNAKE;
    for (let section of this.snake.history) {
      this.boardState[section[0]][section[1]] = TILEMAP.SNAKE_BODY;
    }
  }
}

class Snake {
  constructor() {
    this.direction = DIRECTION.RIGHT;
    this.directionQueue = null;
    this.maxLength = 2;
    this.history = [
      [10, 12],
      [11, 12],
    ];
    this.x = 12;
    this.y = 12;
  }
  possibleMoves() {
    if ([DIRECTION.DOWN, DIRECTION.UP].includes(this.direction)) {
      return ["LEFT", "RIGHT"];
    } else {
      return ["UP", "DOWN"];
    }
  }

  queueChangeDirection(key) {
    if (this.possibleMoves().includes(key)) {
      this.directionQueue = DIRECTION[key];
    }
  }

  move() {
    if (this.directionQueue !== null) {
      this.direction = this.directionQueue;
      this.directionQueue = null;
    }
    this.history.push([this.x, this.y]);

    if (this.history.length >= this.maxLength) {
      this.history.shift();
    } else {
      console.log("NO");
    }

    switch (this.direction) {
      case DIRECTION.UP:
        this.y -= 1;
        break;
      case DIRECTION.RIGHT:
        this.x += 1;
        break;
      case DIRECTION.DOWN:
        this.y += 1;
        break;
      case DIRECTION.LEFT:
        this.x -= 1;
        break;
    }
  }
}
