import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'

const routes = [
  {
    meta: {
      title: 'Dashboard'
    },
    path: '/dashboard',
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
    path: '/courses',
    name: 'courses',
    component: () => import('../views/courses/CoursesView.vue')
  },
  {
    path: '/add-course',
    name: 'add-course',
    component: () => import('../views/courses/AddCourse.vue')
  },
  {
    path: '/edit-course/:id',
    name: 'edit-course',
    component: () => import('../views/courses/EditCourse.vue')
  },
  {
    path: '/add-degree',
    name: 'add-degree',
    component: () => import('../views/degrees/AddDegree.vue')
  },
  {
    path: '/degrees',
    name: 'degrees',
    component: () => import('../views/degrees/DegreesView.vue')
  },
  {
    path: '/documents',
    name: 'documents',
    component: () => import('../views/documents/DocumentsView.vue')
  },
  {
    path: '/view-document/:id',
    name: 'view-document',
    component: () => import('../views/documents/ReviewDocument.vue')
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/notifications/NotificationsView.vue')
  },
  {
    path: '/feedback',
    name: 'feedback',
    component: () => import('../views/Feedbacks.vue')
  },
  {
    path: '/add-notification',
    name: 'add-notification',
    component: () => import('../views/notifications/AddNotification.vue')
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
