import router from '@/router'

router.addRoute('marketing', {
  path: '/hotel/sadmin/referral-detail',
  name: 'referralDetail',
  meta: { requiresAuth: true },
  component: () => import('./View.vue')
})
