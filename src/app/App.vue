<template>
  <div>
    <div id="overlay">
      <div>
        <button id="startButton" @click="createWorld">Старт</button>
        <p id="loaded_count">_</p>
      </div>
    </div>
    <div class="main" id="main">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import "./style.css";
import Vue from "vue";
import { start } from "../bvp_lib/start";
import { World } from "../bvp_lib/types";

export default Vue.extend({
  data() {
    return {
      world: null as World
    };
  },
  methods: {
    createWorld() {
      start(this.onLoadHandler).then(world => {
        document.getElementById("overlay").remove();
        this.world = world;
      });
    },

    onLoadHandler(total: number) {
      document.getElementById("loaded_count").innerText = total.toString();
    }
  },
  computed: {},
  created() {}
});
</script>

<style></style>
