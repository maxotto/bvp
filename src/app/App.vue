<template>
  <div>
    <div id="overlay">
      <div>
        <b-button
          type="is-primary"
          @click="createWorld"
          :disabled="loading"
          :loading="loading"
        >Старт</b-button>
        <p id="loaded_count">0</p>
      </div>
    </div>
    <div class="main" id="main">
      <canvas id="canvas"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { start } from "../bvp_lib/start";
import { World } from "../bvp_lib/types";

export default Vue.extend({
  data() {
    return {
      world: null as World,
      loading: false
    };
  },
  methods: {
    createWorld() {
      this.loading = true;
      start(this.onLoadHandler).then(world => {
        document.getElementById("overlay").remove();
        this.world = world;
        this.loading = false;
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

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
body {
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1 0 auto;
  background-color: rgb(0, 0, 0);
}

#overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  background-color: #000000;
  z-index: 1;
}

#overlay > div {
  text-align: center;
}

#overlay > div > p {
  color: #ffffff;
  font-size: 12px;
}
</style>
