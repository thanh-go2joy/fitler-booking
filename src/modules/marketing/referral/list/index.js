import router from '@/router'

router.addRoute('marketing', {
  path: '/hotel/sadmin/referral',
  name: 'referral',
  meta: { requiresAuth: true },
  component: () => import('./View.vue')
})
