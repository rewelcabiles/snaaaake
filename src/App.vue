<script setup>
import { GameManager } from "@/snake";
import { tileSize } from "@/canvas";
import { onMounted, ref } from "vue";
import {BOARD_SIZE} from "@/config";

const gameManager = new GameManager();
let gameCanvas = ref(null);

onMounted(() => {
  gameManager.runSim(gameCanvas);
  window.addEventListener("keypress", function (ev) {
    if (ev.key === "space") {
      gameManager.toggleSimRunning()
    }
  });
});


</script>

<template>
  <div class="m-4 flex flex-row">
    <canvas
      class="border-2"
      ref="gameCanvas"
      :width="tileSize * BOARD_SIZE"
      :height="tileSize * BOARD_SIZE"
    />
    <div class="w-full ml-10 flex flex-col text-sm">
      <div
        v-for="(value, key, index) in gameManager.getCurrentGameInfo()"
        :key="index"
        class="flex flex-row"
      >
        <div class="w-full font-bold">
          {{ key }}
        </div>
        <div class="w-full">
          {{ value }}
        </div>
      </div>
    </div>
    <div class="w-full">
      <div class="font-bold">Keys</div>
      - seconds per steps: [ <br />
      + seconds per steps: ] <br />
      Movement: w, a, s, d <br />
    </div>
  </div>
</template>

<style scoped></style>
