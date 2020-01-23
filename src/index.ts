import Vue from "vue"
import "@mdi/font/css/materialdesignicons.css";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
Vue.use(Buefy);

const App = () => import('./app/App.vue')

new Vue({
  render: h => h(App),
}).$mount('#app')