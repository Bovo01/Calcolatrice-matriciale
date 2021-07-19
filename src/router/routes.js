const routes = [{
    name: 'calculator',
    path: '/',
    component: () => import('src/pages/Calculator.vue'),
  },
  {
    name: 'add-matrix',
    path: '/add-matrix',
    component: () => import('src/pages/AddMatrix.vue'),
  },

  {
    path: '/add-matrix',
    name: "Aggiungi matrice",
    component: () => import('src/pages/AddMatrix.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
