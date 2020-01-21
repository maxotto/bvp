import Vue from "vue"

const App = () => import('./app/App.vue')

new Vue({
  render: h => h(App),
}).$mount('#app')