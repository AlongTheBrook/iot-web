// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VeeValidate, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import VTooltip from 'v-tooltip'
import axios from 'axios'

Vue.config.productionTip = false

Validator.localize('zh_CN', zhCN)
Vue.use(VeeValidate)

Vue.use(VTooltip)

// noinspection JSUnusedGlobalSymbols
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
