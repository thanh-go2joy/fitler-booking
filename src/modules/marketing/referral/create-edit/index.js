import router from '@/router'

router.addRoute('marketing', {
  path: '/hotel/sadmin/create-edit-referral',
  name: 'createEditReferral',
  meta: { requiresAuth: true },
  component: () => import('./View.vue')
})
