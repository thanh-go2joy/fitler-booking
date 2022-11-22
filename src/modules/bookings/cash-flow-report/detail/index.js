import router from '@/router'

router.addRoute('booking', {
  name: 'cashFlowReportDetail',
  path: '/hotel/sadmin/cash-flow-report/detail',
  meta: { requiresAuth: true },
  component: () => import('./View.vue')
})
