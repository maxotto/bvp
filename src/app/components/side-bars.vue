<template>
  <div>
    <div id="leftsidebar">
      <div class="block">
        <div>
          <b-icon icon="account" size="is-small" type="is-success"></b-icon>
        </div>
        <div>
          <b-icon icon="home" size="is-small" type="is-info"></b-icon>
        </div>
        <div>
          <b-icon icon="view-dashboard" size="is-small" type="is-primary"></b-icon>
        </div>
      </div>
    </div>
    <div id="bottomsidebar">
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
</template>

<script lang="ts">
//TODO refactor this with @Component decorator
import Vue from "vue";
import { SceneManager } from "../../bvp_lib/SceneManager";

export default Vue.extend({
  props: ["allowSlideControl"],
  data() {
    return {
      inMove: false,
      buttonstate: {
        first: false,
        prev: false,
        next: true,
        last: true
      }
    };
  },
  methods: {
    slideNavigate(command) {
      this.inMove = true;
      const sm = <SceneManager>this.$bvp.sceneManager;
      sm.slidesController.navigate(command).then(state => {
        console.log("movement done", { state });
        const length = state.steps.length;
        console.log({ length });
        if (state.current === 0) {
          this.buttonstate = {
            first: false,
            prev: false,
            next: true,
            last: true
          };
        } else if (state.current === length - 1) {
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
        console.log(this.buttonstate);
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
  left: -75px;
  z-index: 2;
  width: 100px;
  height: 100%;
  transition-property: left, background;
  transition-duration: 0.3s;
  transition-timing-function: ease-in, ease, linear;
}

#leftsidebar:hover {
  width: 100px;
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
  transition-property: bottom, background;
  transition-duration: 0.3s;
  transition-timing-function: ease-in, ease;
}

#bottomsidebar:hover {
  bottom: 0px;
  background: rgba(32, 32, 32, 0.7);
}
</style>
