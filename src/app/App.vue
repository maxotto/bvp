<template>
  <div>
    <div id="overlay">
      <div>
        <button id="startButton" @click="createWorld">Старт</button>
        <p id="loaded_count">-</p>
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

export default Vue.extend({
  data() {
    return {
      world: { panoRadius: 400 },
      name: "BVP",
      text: "My text"
    };
  },
  methods: {
    createWorld() {
      start().then(() => {
        document.getElementById("overlay").remove();
      });
    }
  },
  computed: {},
  created() {}
});
</script>

<style></style>
