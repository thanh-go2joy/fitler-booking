import router from '@/router'

router.addRoute('marketing', {
  path: '/hotel/sadmin/lucky-wheel',
  name: 'luckyWheel',
  meta: { requiresAuth: true },
  component: () => import('./View.vue')
})
