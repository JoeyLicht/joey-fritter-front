<!-- Form for getting freets (freet type matches feed preference) -->

<template>
  <article
    class="feedToggle" 
  >
    <button
      v-if="$store.state.feedFilter"
      @click="toggleFeed"
    >
      Remove Feed Filter
    </button>
    <button
      v-else
      @click="toggleFeed"
    >
      Filter Feed By Your Preferences
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>

</template>



<script>


export default {
  name: 'GetFeedFreetsForm',
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    async toggleFeed() {
      this.$store.commit('updateFeedFilter', !this.$store.state.feedFilter);

      this.$store.commit('refreshFreets');
    }
  }
};
</script>


<style scoped>
form {
    display: flex;
    position: relative;
}

button {
    padding: 0 10px;
    min-width: 200px;
}
</style>
