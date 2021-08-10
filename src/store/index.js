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
      setMatAns(state, matrix) {
        if (matrix instanceof Matrix)
          state.matAns = matrix;
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
