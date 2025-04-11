import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main.vue'
import NumberData from '@/components/DataForm.vue'
import Config from '@/components/Config.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/form',
      name: 'NumberData',
      component: NumberData
    },
    {
      path: '/config',
      name: 'Config',
      component: Config
    }
  ]
})
