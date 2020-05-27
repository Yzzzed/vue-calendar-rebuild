import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'Login',
    component: () => import('@/pages/login/Login')
  }, {
    path: '/home',
    redirect: '/home/all',
    name: 'Home',
    meta: {
      requireAuth: true
    },
    component: () => import('@/pages/home/Home'),
    children: [{
      path: 'all',
      name: 'All',
      component: () => import('@/pages/home/components/All')
    }, {
      path: ':id',
      name: 'Personal',
      component: () => import('@/pages/home/components/Personal')
    }]
  }, {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/register/Register')
  }]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next()
  }
})

export default router
