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
    <div id="overlayInner"></div>
    <side-bars :allowSlideControl="allowSlideControl"></side-bars>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SideBars from "./components/side-bars.vue";
//TODO refactor this with @Component decorator
export default Vue.extend({
  data() {
    return {
      allowSlideControl: false,
      loading: false
    };
  },
  components: {
    SideBars
  },
  methods: {
    createWorld() {
      this.loading = true;
      this.$bvp
        .start(this.onLoadHandler)
        .then(sceneManager => {
          document.getElementById("overlay").remove();
          this.loading = false;
          this.allowSlideControl = true;
        })
        .catch(e => {
          console.log({ e });
          this.loading = false;
          document.getElementById("loaded_count").textContent =
            `There was an error. File: ` + e.responseURL + " - " + e.statusText;
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
  z-index: 0;
}

#overlay > div {
  text-align: center;
}

#overlay > div > p {
  color: #ffffff;
  font-size: 12px;
}
</style>
