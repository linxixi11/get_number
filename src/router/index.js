import Vue from 'vue'
import Router from 'vue-router'
import NumberData from '@/components/DataForm.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/form',
      name: 'NumberData',
      component: NumberData
    }
  ]
})
