import {
  model as Wodel,
  argMax,
  tensor2d,
  sequential,
  layers,
  randomUniform,
  randomNormal,
  concat,
  tidy,
} from "@tensorflow/tfjs";
import { BOARD_SIZE } from "@/config";

const model = sequential();

// Add a convolutional layer
model.add(
  layers.conv2d({
    inputShape: [BOARD_SIZE, BOARD_SIZE, 1], // The input shape of the images, in this case 28x28 pixels and 1 color channel
    filters: 32, // The number of filters in the convolutional layer
    kernelSize: 3, // The size of the convolutional kernel
    activation: "relu", // The activation function to use
  })
);

// Add a max pooling layer
model.add(
  layers.maxPooling2d({
    poolSize: 2, // The size of the max pooling window
  })
);

// Add another convolutional layer
model.add(
  layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: "relu",
  })
);

// Add another max pooling layer
model.add(
  layers.maxPooling2d({
    poolSize: 2,
  })
);

// Flatten the output of the previous layers
model.add(layers.flatten());

// Add a fully connected layer
model.add(
  layers.dense({
    units: 64,
    activation: "relu",
  })
);

// Add the output layer
model.add(
  layers.dense({
    units: 4, // The number of output classes
    activation: "softmax",
  })
);

import { POPULATION_CONFIG } from "@/config";
export class Population {
  constructor() {
    this.mutationRate = POPULATION_CONFIG.MUTATION_RATE;
    this.populationSize = POPULATION_CONFIG.POPULATION_SIZE;
    this.model = model;
    this.population = this.generatePopulation();
    this.generation = 0;

  }

  // Create a new population
  generatePopulation() {
    let population = [];
    for (let i = 0; i < this.populationSize; i++) {
      population.push(this.generateSnake());
    }
    return population;
  }

  generateSnake() {
    let newModel = Wodel({
      inputs: this.model.inputs,
      outputs: this.model.outputs,
    });
    let weights = this.model.getWeights();
    let newWeights = weights.map((w) => w.clone());
    newModel.setWeights(newWeights);
    return newModel;
  }

  predict(model, gameState) {
    const inputTensor = tensor2d(
      gameState,
      [BOARD_SIZE, BOARD_SIZE],
      "float32"
    );
    const inputTensor4D = inputTensor.reshape([1, BOARD_SIZE, BOARD_SIZE, 1]);
    const prediction = model.predict(inputTensor4D);
    return argMax(prediction, 1).dataSync()[0];
  }

  crossover(parent1, parent2) {
    let weights1 = parent1.model.getWeights();
    let weights2 = parent2.model.getWeights();
    let newWeights = weights1.map((w, i) =>
      tidy(() => concat([w, weights2[i]], 1).mean(1))
    );
    let child = parent1.model.clone();
    child.setWeights(newWeights);
    return child;
  }

  mutate(model, mutationRate) {
    let weights = model.getWeights();
    let newWeights = weights.map((w) =>
      tidy(() => {
        let shape = w.shape;
        let randomTensor = randomNormal(shape, 0, 1);
        let mask = randomUniform(shape, 0, 1)
          .greater(mutationRate)
          .cast("float32");
        return w.add(randomTensor.mul(mask));
      })
    );
    model.setWeights(newWeights);
    return model;
  }
}
