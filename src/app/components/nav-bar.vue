<template>
  <div id="left-side-bar">
    <ul>
      <li class="list-group-item" v-for="(step, index) in steps" v-bind:key="index">
        <a :class="{disabled:inMove}" @click="navigate(index)">
          <img :src="snapshots[step.slide]" />
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
//TODO refactor this with @Component decorator
//TODO current slide must be selected and be visible
import Vue from "vue";
import { SceneManager } from "../../bvp_lib/SceneManager";
import { Slide, World } from "../../bvp_lib/types";

export default Vue.extend({
  props: ["sceneManager", "inMove"],
  data() {
    return {
      steps: [],
      snapshots: []
    };
  },
  methods: {
    navigate(index) {
      if (!this.inMove) this.$emit("navigateTo", index);
    }
  },
  watch: {
    sceneManager: function(val: SceneManager) {
      if (val) {
        this.steps = val.world.steps;
        const slides: Slide[] = val.world.slides;
        slides.forEach(slide => {
          this.snapshots.push(slide.snapshot);
        });
      }
    }
  },
  created() {}
});
</script>
<style scoped>
ul {
  list-style-type: none;
}
a.disabled {
  cursor: not-allowed;
}
#left-side-bar {
  overflow-y: auto;
}
</style>

