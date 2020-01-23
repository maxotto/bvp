<template>
  <div>
    <div id="leftsidebar">
      <div class="block">
        <div>
          <b-icon icon="account" size="is-large" type="is-success"></b-icon>
        </div>
        <div>
          <b-icon icon="home" size="is-large" type="is-info"></b-icon>
        </div>
        <div>
          <b-icon icon="view-dashboard" size="is-large" type="is-primary"></b-icon>
        </div>
      </div>
    </div>
    <div id="bottomsidebar">
      <div class="buttonspace" @click="slideNavigate('first')">
        <b-icon icon="arrow-collapse-left" size="is-large" type="is-success"></b-icon>
      </div>
      <div class="buttonspace" @click="slideNavigate('prev')">
        <b-icon icon="arrow-left" size="is-large" type="is-success"></b-icon>
      </div>
      <div class="buttonspace" @click="slideNavigate('next')">
        <b-icon icon="arrow-right" size="is-large" type="is-success"></b-icon>
      </div>
      <div class="buttonspace" @click="slideNavigate('last')">
        <b-icon icon="arrow-collapse-right" size="is-large" type="is-success"></b-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
//TODO refactor this with @Component decorator
import Vue from "vue";
import { SceneManager } from '../../bvp_lib/SceneManager';

export default Vue.extend({
  methods: {
    slideNavigate(command) {
      console.log(command);
      console.log(this.$bvp);
      const sm = <SceneManager>this.$bvp.sceneManager
      sm.slidesController.navigate(command)
    }
  }
});
</script>

<style>
.buttonspace {
  width: 150px;
  display: flex;
  justify-content: center;
  background: rgba(139, 220, 245, 0.4);
  margin: 5px;
  border-radius: 24px;
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
  bottom: -80px;
  left: 0px;
  z-index: 2;
  width: 100%;
  height: 100px;
  transition-property: bottom, background;
  transition-duration: 0.3s;
  transition-timing-function: ease-in, ease, linear;
}

#bottomsidebar:hover {
  bottom: 0px;
  background: rgba(100, 100, 100, 0.3);
}
</style>
