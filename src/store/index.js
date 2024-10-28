// store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    alertClass: '',
    alertMessage: ''
  },
  mutations: {
    SET_ALERT(state, { alertClass, alertMessage }) {
      state.alertClass = alertClass;
      state.alertMessage = alertMessage;
    },
    CLEAR_ALERT(state) {
      state.alertClass = '';
      state.alertMessage = '';
    }
  },
  actions: {
    setAlert({ commit }, payload) {
      commit('SET_ALERT', payload);
    },
    clearAlert({ commit }) {
      commit('CLEAR_ALERT');
    }
  }
});

export default store;
