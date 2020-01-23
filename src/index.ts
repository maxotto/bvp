import Vue from "vue"
import "@mdi/font/css/materialdesignicons.css";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
Vue.use(Buefy);
import { BvpPlugin } from "./bvp_lib/vuePlugin";
Vue.use(BvpPlugin, {
  //TODO set not fixed project
  project: "Adamov202001_01",
  canvas: <HTMLCanvasElement>document.getElementById("canvas")
});


const App = () => import('./app/App.vue')

new Vue({
  render: h => h(App),
}).$mount('#app')