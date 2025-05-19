import {
  mdiAccountCircle,
  mdiMonitor,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiCalendarQuestion,
  mdiSchool,
  mdiAccountSchool,
  mdiTicket,
  mdiFileDocument,
  mdiBook,
  mdiChairSchool,
  mdiFileDocumentAlert,
  mdiNotificationClearAll
} from '@mdi/js'

export default [
  {
    to: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard'
  },
  {
    to: '/universities',
    icon: mdiSchool,
    label: 'Universities'
  },
  {
    to: '/students',
    icon: mdiAccountSchool,
    label: 'Students'
  },
  {
    to: '/applications',
    icon: mdiFileDocument,
    label: 'Applications'
  },
  {
    to: '/documents',
    icon: mdiFileDocumentAlert,
    label: 'Documents'
  },
  {
    to: '/courses',
    icon: mdiBook,
    label: 'Courses'
  },
  {
    to: '/degrees',
    icon: mdiChairSchool,
    label: 'Degrees'
  },
  {
    to: '/tickets',
    icon: mdiTicket,
    label: 'Tickets'
  },
  {
    to: '/notifications',
    icon: mdiNotificationClearAll,
    label: 'Notifications'
  },
  {
    to: '/feedback',
    label: 'Feedback',
    icon: mdiCalendarQuestion
  },
]
