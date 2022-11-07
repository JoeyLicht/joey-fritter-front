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
    feedFilter: false, // Special filter to match user's feed preferences
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    usernameId: null, // Username id of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    likes: [], // All likes created in the app
    fullStories: [], // All full Stories created in the app
    freetTypes: [], // All freet types in the app
    feeds: [], // All freet types in the app
    authorFreets: [] //All freets the author has created
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
    updateFeedFilter(state, feedFilter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to filter freets by
       */
      state.feedFilter = feedFilter;
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
      const url = state.feedFilter ? `/api/feeds` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshAuthorFreets(state) {
      /**
       * Request the server for the currently available author freets.
       */
      const url = `/api/freets?author=${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      state.authorFreets = res;
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
    },
    async refreshFeeds(state) {
      /**
       * Request the server for the currently available feeds.
       */
      const url = '/api/feeds';
      const res = await fetch(url).then(async r => r.json());
      state.feeds = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
