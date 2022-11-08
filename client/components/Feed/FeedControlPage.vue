<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.preferences.user === $store.state.username">
      <header>
        <h2>
          @{{ $store.state.username }}'s Current Feed Settings Filled In
        </h2>
      </header>
      <UpdateFeedForm />
    </section>
    <section v-else>
      <NotFound />
    </section>
  </main>
</template>

<script>
import CreateFeedForm from '@/components/Feed/CreateFeedForm.vue';
import UpdateFeedForm from '@/components/Feed/UpdateFeedForm.vue';
import NotFound from '@/NotFound.vue';

export default {
  name: 'FeedControlPage',
  components: {CreateFeedForm, UpdateFeedForm, NotFound},
  mounted() {
    this.$store.commit('refreshPreferences');
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

h2 {
  color: white;
  text-align: center;
  margin: auto;
  margin-bottom: 1em;
}

* {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
