import Vue from 'vue'
import Router from 'vue-router'
import DeviceCfg from '@/components/DeviceCfg'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DeviceCfg',
      component: DeviceCfg
    }
  ]
})
