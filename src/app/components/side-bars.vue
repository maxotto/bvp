<template>
  <div>
    <div id="leftsidebartoggler" @mousemove="leftmousemove"></div>
    <div id="leftsidebar"></div>
    <div id="bottomsidebartoggler"></div>
    <div id="bottomsidebar"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class SideBars extends Vue {
  openLeftSideBar: boolean = false;
  created() {
    // alert("sidebars created");
  }
  leftmousemove(event) {
    if (!this.openLeftSideBar) {
      this.openLeftSideBar = true;
    }
    console.log(event);
  }
  @Watch("openLeftSideBar") onLeftSideBarToggle(
    value: boolean,
    oldValue: boolean
  ) {
    console.log({ value }, { oldValue });
    if (value) {
      const el = <HTMLElement>document.getElementById("leftsidebar");
      el.style.left = "0px";
    }
  }
}
</script>
<style>
#leftsidebartoggler {
  background-color: rgb(194, 245, 194);
  position: absolute;
  top: 0px;
  left: 0px;

  z-index: 2;
  width: 10px;
  height: 100%;
}
#leftsidebar {
  background-color: rgb(228, 150, 4);
  position: absolute;
  top: 0px;
  left: -100px;

  z-index: 0;
  width: 100px;
  height: 100%;
}
#bottomsidebartoggler {
  background: rgba(103, 240, 164, 0.5);
  position: absolute;
  bottom: 0px;
  left: 0px;

  z-index: 2;
  width: 100%;
  height: 10px;
}
#bottomsidebar {
  background: rgba(241, 245, 1, 0.5);
  position: absolute;
  bottom: -100px;
  left: 0px;

  z-index: 0;
  width: 100%;
  height: 100px;
}
</style>