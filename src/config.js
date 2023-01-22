// Model

export const POPULATION_CONFIG = {
  POPULATION_SIZE: 10,
  MUTATION_RATE: 0.1,
};

export const TILEMAP = {
  EMPTY: 0,
  WALL: 1,
  SNAKE: 2,
  SNAKE_BODY: 3,
  APPLE: 4,
};

export const BOARD_SIZE = 24;

export const DIRECTION = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

export const keyboardMap = {
  w: "UP",
  d: "RIGHT",
  s: "DOWN",
  a: "LEFT",
};

const TopLeft = [-1, -1];
const Top = [0, -1];
const TopRight = [1, -1];
const Right = [1, 0];
const BottomRight = [1, 1];
const Bottom = [0, 1];
const BottomLeft = [-1, 1];
const Left = [-1, 0];
export const visionMap = {
  0: [TopLeft, Top, TopRight],
  1: [TopRight, Right, BottomRight],
  2: [BottomRight, Bottom, BottomLeft],
  3: [BottomLeft, Left, TopLeft],
};
