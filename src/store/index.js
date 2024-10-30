// store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    alertClass: '',
    alertMessage: '',
    canUploadFile: false
  },
  mutations: {
    SET_ALERT(state, { alertClass, alertMessage }) {
      state.alertClass = alertClass;
      state.alertMessage = alertMessage;
    },
    SET_CAN_UPLOAD(state, canUploadFile) {
      state.canUploadFile = canUploadFile;
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
    setCanUpload({ commit }, payload) {
      commit('SET_CAN_UPLOAD', payload);
    },
    clearAlert({ commit }) {
      commit('CLEAR_ALERT');
    }
  }
});

export default store;
