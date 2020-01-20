<template>
  <div>
    <div>
      I am Vue App from
      <i>/src/app/App.vue!</i>
    </div>
    <p>{{ name }}</p>
    <p>{{ world.panoRadius }}</p>
    <b-button type="is-link">Click Me</b-button>
    <section>
      <button class="button is-medium is-primary" @click="alert">
        Launch alert (default)
      </button>
      <button class="button is-medium is-primary" @click="alertCustom">
        Launch alert (custom)
      </button>
      <button class="button is-medium is-danger" @click="alertCustomError">
        Launch alert (custom)
      </button>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["world", "name"],
  data() {
    return {
      text: "My text"
    };
  },
  methods: {
    alert() {
      this.$buefy.dialog.alert("Everything looks fine!");
    },
    alertCustom() {
      this.$buefy.dialog.alert({
        title: "Title Alert",
        message: "I have a title, a custom button and <b>HTML</b>!",
        confirmText: "Cool!"
      });
    },
    alertCustomError() {
      this.$buefy.dialog.alert({
        title: "Error",
        message:
          "Something's not good but I have a custom <b>icon</b> and <b>type</b>",
        type: "is-danger",
        hasIcon: true,
        icon: "times-circle",
        iconPack: "fa",
        ariaRole: "alertdialog",
        ariaModal: true
      });
    }
  },
  computed: {},
  created() {
    console.log("App created");
  }
});
</script>

<style></style>
