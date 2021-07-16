const routes = [{
    path: '/',
    component: () => import('src/pages/Index.vue'),
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
