import Vue from 'vue'
import App from './app.vue'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$http = axios

const app : any = new Vue({
  render: h => h(App)
}).$mount('#app')
