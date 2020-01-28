<template>
  <div>
    <div id="leftsidebar">
      <NavBar :sceneManager="sceneManager" :inMove="inMove" @navigateTo="slideNavigate"></NavBar>
    </div>
    <div id="bottomsidebar">
      <div id="buttons-container">
        <b-button
          type="is-success"
          outlined
          size="is-small"
          icon-left="arrow-collapse-left"
          :disabled="inMove || !allowSlideControl || !buttonstate['first']"
          @click="slideNavigate('first')"
        ></b-button>
        <div class="spacer"></div>
        <b-button
          type="is-success"
          outlined
          size="is-small"
          icon-left="arrow-left"
          :disabled="inMove || !allowSlideControl || !buttonstate['prev']"
          @click="slideNavigate('prev')"
        ></b-button>
        <div class="spacer"></div>
        <b-button
          type="is-success"
          outlined
          size="is-small"
          icon-left="arrow-right"
          :disabled="inMove || !allowSlideControl || !buttonstate['next']"
          @click="slideNavigate('next')"
        ></b-button>
        <div class="spacer"></div>
        <b-button
          type="is-success"
          outlined
          size="is-small"
          icon-left="arrow-collapse-right"
          :disabled="inMove || !allowSlideControl || !buttonstate['last']"
          @click="slideNavigate('last')"
        ></b-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
//TODO refactor this with @Component decorator
import Vue from "vue";
import { SceneManager } from "../../bvp_lib/SceneManager";
import NavBar from "./nav-bar.vue";

export default Vue.extend({
  components: {
    NavBar
  },
  props: ["allowSlideControl"],
  data() {
    return {
      sceneManager: <SceneManager>null,
      steps: [],
      inMove: false,
      buttonstate: {
        first: false,
        prev: false,
        next: true,
        last: true
      }
    };
  },
  watch: {
    allowSlideControl: function(val) {
      if (val) {
        this.sceneManager = <SceneManager>this.$bvp.sceneManager;
        this.steps = this.sceneManager.world.steps;
      }
    }
  },
  methods: {
    slideNavigate(command) {
      this.inMove = true;
      this.sceneManager.slidesController.navigate(command).then(current => {
        const length = this.steps.length;
        if (current === 0) {
          this.buttonstate = {
            first: false,
            prev: false,
            next: true,
            last: true
          };
        } else if (current === length - 1) {
          this.buttonstate = {
            first: true,
            prev: true,
            next: false,
            last: false
          };
        } else {
          this.buttonstate = {
            first: true,
            prev: true,
            next: true,
            last: true
          };
        }
        this.inMove = false;
      });
    }
  },
  created() {}
});
</script>

<style>
.spacer {
  width: 15px;
}
#leftsidebar {
  display: flex;
  align-items: top;
  justify-content: center;
  background: rgba(1, 1, 1, 0.04);
  position: absolute;
  top: 0px;
  left: -180px;
  z-index: 2;
  width: 190px;
  height: 100%;
  transition-property: left, background;
  transition-duration: 0.3s;
  transition-timing-function: ease-in, ease;
}

#leftsidebar:hover {
  left: 0px;
  background: rgba(198, 245, 145, 0.3);
}

#bottomsidebar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.003);
  position: absolute;
  bottom: -40px;
  left: 0px;
  z-index: 2;
  width: 100%;
  height: 50px;
  transition-property: bottom;
  transition-duration: 0.3s;
  transition-timing-function: ease-in;
}

#bottomsidebar:hover {
  bottom: 0px;
}
#buttons-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 50px;
  background: rgba(32, 32, 32, 0.7);
}
</style>
