<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2></h2>
      </header>
      <CreateFreetForm />
      <CreateFreetWithFullForm />
    </section>
    <section v-if="$store.state.username">
      <header>
        <div class="left">
          <h2>
            Viewing all freets
            <span>
              by @{{ $store.state.username }}
            </span>
          </h2>
        </div>
      
        <div class="right">
          <GetFeedFreetsForm />
        </div>
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
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import CreateFreetWithFullForm from '@/components/Freet/CreateFreetWithFullForm.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';


export default {
  name: 'CreateFreetPage',
  components: {CreateFreetForm, CreateFreetWithFullForm, FreetComponent},
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
