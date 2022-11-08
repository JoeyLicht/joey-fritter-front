<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username && $store.state.username === $store.state.preferences.user">
      <header>
        <h2></h2>
      </header>
      <CreateFreetForm />
    </section>
    <section v-if="$store.state.username && $store.state.username === $store.state.preferences.user">
      <header>
        <h2 class="authorFreets">
          Viewing all freets by @{{ $store.state.username }}
        </h2>
      </header>
      <section
        v-if="$store.state.authorFreets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.authorFreets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>You must create your first freet to see it here</h3>
      </article>
    </section>
    <section v-else>
      <NotFound />
    </section>
  </main>
</template>

<script>
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import NotFound from '@/NotFound.vue';

export default {
  name: 'CreateFreetPage',
  components: {CreateFreetForm, FreetComponent, NotFound},
  mounted() {
    this.$store.commit('refreshAuthorFreets');
    this.$store.commit('refreshLikes');
    this.$store.commit('refreshFullStories');
    this.$store.commit('refreshFreetTypes');
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

.authorFreets {
  color: white;
  text-align: center;
  margin-top: 1.5em;
}

/* header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
} */

* {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
