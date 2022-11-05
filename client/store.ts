import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various components.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    usernameId: null, // Username id of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    likes: [], // All likes created in the app
    fullStories: [], // All full Stories created in the app
    freetTypes: [] // All freet types in the app
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setUsernameId(state, usernameId) {
      /**
       * Update the stored username to the specified one.
       * @param usernameId - new usernameId to set
       */
      state.usernameId = usernameId;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to filter freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshLikes(state) {
      /**
       * Request the server for the currently available likes.
       */
      const url = '/api/likes';
      const res = await fetch(url).then(async r => r.json());
      state.likes = res;
    },
    async refreshFullStories(state) {
      /**
       * Request the server for the currently available full stories.
       */
      const url = '/api/fullStories';
      const res = await fetch(url).then(async r => r.json());
      state.fullStories = res;
    },
    async refreshFreetTypes(state) {
      /**
       * Request the server for the currently available freet types.
       */
      const url = '/api/freetTypes';
      const res = await fetch(url).then(async r => r.json());
      state.freetTypes = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
