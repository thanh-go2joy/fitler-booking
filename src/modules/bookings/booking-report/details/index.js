import router from '@/router'

router.addRoute('booking', {
  name: 'firstBookingDetails',
  path: '/hotel/sadmin/booking-details/:sn',
  meta: { requiresAuth: true },
  component: () => import('./View.vue')
})
