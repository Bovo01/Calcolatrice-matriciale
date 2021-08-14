const routes = [{
    name: 'calculator',
    path: '/',
    component: () => import('src/pages/Calculator.vue'),
  },
  {
    name: 'Aggiungi dim matrice',
    path: '/add-matrix/dim',
    component: () => import('src/pages/AddMatrix-dim.vue'),
  },

  {
    name: "Aggiungi matrice righe",
    path: '/add-matrix/rows',
    component: () => import('src/pages/AddMatrix-rows.vue'),
  },

  {
    name: "Visualizza matrice",
    path: '/view-matrix/:name',
    component: () => import('src/pages/AddMatrix-rows.vue'),
  },

  {
    name: "Rimuovi matrice",
    path: '/remove-matrix',
    component: () => import('src/pages/RemoveMatrix.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
