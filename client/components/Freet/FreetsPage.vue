<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="True">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
      <CreateFeedForm />
      <UpdateFeedForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all freets
            <span v-if="$store.state.feedFilter">
              that match user preference
            </span>
            <span v-else-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get freets"
          />
        </div>
        <div class="right">
          <GetFeedFreetsForm
            ref="getFeedFreetsForm"
            value="todo"
            placeholder="🔍 Todo"
            button="🔄 Toggle Feed Mode"
          />
        </div>
      </header>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
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
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import CreateFeedForm from '@/components/Feed/CreateFeedForm.vue';
import UpdateFeedForm from '@/components/Feed/UpdateFeedForm.vue';
import GetFeedFreetsForm from '@/components/Feed/GetFeedFreetsForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, 
               CreateFreetForm, CreateFeedForm, 
               UpdateFeedForm, GetFeedFreetsForm},
  mounted() {
    this.$refs.getFreetsForm.submit();
    this.$store.commit('refreshLikes');
    this.$store.commit('refreshFullStories');
    this.$store.commit('refreshFreetTypes');
    this.$store.commit('refreshFeeds');
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

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
