import router from '@/router'

router.addRoute('booking', {
  name: 'bookingReportTransfer',
  path: '/hotel/sadmin/booking-report-transfer/:sn',
  meta: { requiresAuth: true },
  component: () => import('./View.vue')
})
