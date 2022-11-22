import router from '@/router'

router.addRoute('marketing', {
  path: '/hotel/sadmin/referral-report',
  name: 'referralReport',
  meta: { requiresAuth: true },
  component: () => import('./View.vue')
})
