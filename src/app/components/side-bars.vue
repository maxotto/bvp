<template>
  <div>
    <div id="leftsidebar" @mousemove="leftmousemove">
      <div class="block">
        <div>
          <b-icon icon="account" size="is-large" type="is-success"></b-icon>
        </div>
        <div>
          <b-icon icon="home" size="is-large" type="is-info"></b-icon>
        </div>
        <div>
          <b-icon
            icon="view-dashboard"
            size="is-large"
            type="is-primary"
          ></b-icon>
        </div>
      </div>
    </div>
    <div id="bottomsidebar" @mousemove="bottommousemove"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class SideBars extends Vue {
  created() {
    // alert("sidebars created");
  }
  leftmousemove(event) {
    console.log("leftmousemove", event);
  }
  bottommousemove(event) {
    console.log("bottommousemove", event);
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
.block {
}
#leftsidebar {
  display: flex;
  align-items: top;
  justify-content: center;
  background: rgba(1, 1, 1, 0.04);
  position: absolute;
  top: 0px;
  left: -80px;
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
