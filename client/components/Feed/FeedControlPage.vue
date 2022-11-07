<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <section v-if="$store.state.preferences.user !== $store.state.username">
        <header>
          <h2>
            Feed Preferences for @{{ $store.state.username }} @{{ $store.state.preferences }} @{{ $store.state.preferences.user !== $store.state.username }}
          </h2>
        </header>
        <CreateFeedForm />
      </section>
      <section v-else>
        <header>
          <h2>
            Current Preferences @{{ $store.state.preferences }} @{{ $store.state.preferences.user !== $store.state.username }}
          </h2>
        </header>
        <UpdateFeedForm />
      </section>
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

* {
  font-family: cursive;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
