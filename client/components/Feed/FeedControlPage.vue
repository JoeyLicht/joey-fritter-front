<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>
          Feed Preferences for @{{ $store.state.username }}
        </h2>
      </header>
      <CreateFeedForm />
      <UpdateFeedForm />
    </section>
  </main>
</template>

<script>
import CreateFeedForm from '@/components/Feed/CreateFeedForm.vue';
import UpdateFeedForm from '@/components/Feed/UpdateFeedForm.vue';


export default {
  name: 'FeedControlPage',
  components: {CreateFeedForm, UpdateFeedForm},
  // mounted() {
  //   this.$refs.getFreetsForm.submit();
  //   this.$store.commit('refreshFeeds');
  //   this.$store.commit('refreshFreets');
  //   this.$store.commit('refreshLikes');
  //   this.$store.commit('refreshFullStories');
  //   this.$store.commit('refreshFreetTypes');
  // }
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
