<template>
  <div class="block">
    <ul>
      <li class="list-group-item" v-for="(step, index) in steps" v-bind:key="index">
        <b-button
          type="is-success"
          outlined
          size="is-small"
          icon-left="account"
          @click="navigate(index)"
        ></b-button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
//TODO refactor this with @Component decorator
import Vue from "vue";
import { SceneManager } from "../../bvp_lib/SceneManager";
import { Slide, World } from "../../bvp_lib/types";

export default Vue.extend({
  props: ["sceneManager", "inMove"],
  data() {
    return {
      steps: []
    };
  },
  methods: {
    navigate(index) {
      this.$emit("navigateTo", index);
    }
  },
  watch: {
    sceneManager: function(val: SceneManager) {
      if (val) {
        this.steps = val.world.steps;
      }
    }
  },
  created() {}
});
</script>
<style scoped>
</style>

