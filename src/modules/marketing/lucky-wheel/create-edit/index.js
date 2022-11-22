import router from '@/router'

router.addRoute('marketing', {
  name: 'createEditLuckyWheel',
  path: 'hotel/sadmin/create-edit-lucky-wheel/:sn?',
  meta: { requiresAuth: true },
  component: () => import('./View.vue')
})
