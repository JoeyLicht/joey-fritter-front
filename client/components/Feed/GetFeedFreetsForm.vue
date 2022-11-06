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
  // data() {},
  methods: {
    async toggleFeed() {
      this.$store.commit('updateFeedFilter', !this.$store.state.feedFilter);

      const url = this.$store.state.feedFilter ? `/api/feeds` : '/api/freets';
      // const url = '/api/freets';
      try {
        const r = await fetch(url);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
 
        if (this.$store.state.feedFilter){
          res = res.map(r => r.publishedContent);
        }

        this.$store.commit('updateFreets', res);

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
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
