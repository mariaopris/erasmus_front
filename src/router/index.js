import { createRouter, createWebHashHistory } from 'vue-router'
import Style from '@/views/StyleView.vue'
import Home from '@/views/HomeView.vue'

const routes = [
  // {
  //   meta: {
  //     title: 'Select style'
  //   },
  //   path: '/',
  //   name: 'style',
  //   component: Style
  // },
  {
    meta: {
      title: 'Dashboard'
    },
    path: '/',
    name: 'dashboard',
    component: Home
  },
  {
    path: '/universities',
    name: 'universities',
    component: () => import('../views/universities/UniversitiesView.vue')
  },
  {
    path: '/add-university',
    name: 'add-university',
    component: () => import('../views/universities/AddUniversity.vue')
  },
  {
    path: '/edit-university/:id',
    name: 'edit-university',
    component: () => import('../views/universities/EditUniversity.vue')
  },
  {
    path: '/import-university',
    name: 'import-university',
    component: () => import('../views/universities/ImportUniversities.vue')
  },
  {
    path: '/students',
    name: 'students',
    component: () => import('../views/StudentsView.vue')
  },
  {
    path: '/tickets',
    name: 'tickets',
    component: () => import('../views/tickets/TicketsView.vue')
  },
  {
    path: '/applications',
    name: 'applications',
    component: () => import('../views/applications/ApplicationsView.vue')
  },
  {
    path: '/view-application/:id',
    name: 'view-application',
    component: () => import('../views/applications/ViewApplication.vue')
  },
  {
    path: '/view-ticket/:id',
    name: 'view-ticket',
    component: () => import('../views/tickets/ViewTicket.vue')
  },
  {
    meta: {
      title: 'Tables'
    },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue')
  },
  {
    meta: {
      title: 'Forms'
    },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Ui'
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: {
      title: 'Error'
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
