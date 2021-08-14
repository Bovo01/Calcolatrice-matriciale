import {
  store
} from 'quasar/wrappers'
import {
  createStore
} from 'vuex'
import createPersistedState from "vuex-persistedstate";
import Fraction from 'src/model/Fraction.js';
import Matrix from 'src/model/Matrix.js';

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function ( /* { ssrContext } */ ) {
  const Store = createStore({
    plugins: [createPersistedState()],
    modules: {
      // example
    },
    getters: {
      matrixes: state => state.matrixes,
      Ans: state => state.ans,
      MatAns: state => state.MatAns
    },
    mutations: {
      addMatrix(state, matrix) {
        state.matrixes.push(matrix);
      },
      /**
       * Il payload contiene due proprietà:
       * name - Il nome della matrice
       * matrix - L'array che contiene la nuova matrice da sostituire a quella salvata
       */
      editMatrix(state, payload) {
        let mat = state.matrixes.filter(m => m.name === payload.name);
        if (mat.length == 0) throw "Matrice non trovata";
        mat[0].matrix = payload.matrix;
      },
      removeMatrixesFromName(state, matrixesNames) {
        state.matrixes = state.matrixes.filter(mat => !matrixesNames.includes(mat.name));
      },
      setMatAns(state, matrix) {
        if (matrix instanceof Matrix)
          state.MatAns = matrix;
      },
      setAns(state, fraction) {
        if (fraction instanceof Fraction)
          state.ans = fraction;
      },
    },
    actions: {},
    state: {
      matrixes: [],
      matAns: null,
      ans: null
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
