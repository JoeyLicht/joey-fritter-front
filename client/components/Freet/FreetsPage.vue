<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2 id="welcomeLoggedIn">
          Welcome @{{ $store.state.username }}
        </h2>
      </header>
      <CreateFreetForm />
      <CreateFeedForm />
      <UpdateFeedForm />
    </section>
    <section v-else>
      <img 
        src="../../public/logo.svg"
      >
      <header class="welcome">
        <h2>
          Welcome to Fritter!
        </h2>
      </header>
      <section class="signIn">
        <LoginForm />
        <RegisterForm />
      </section>
    </section>
    <section v-if="$store.state.username">
      <header>
        <div class="left">
          <h2>
            Viewing all freets
            <span v-if="$store.state.feedFilter">
              that match @{{ $store.state.username }}'s preferences
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
          <GetFeedFreetsForm />
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
import RegisterForm from '@/components/Login/RegisterForm.vue';
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, 
               CreateFreetForm, CreateFeedForm, 
               UpdateFeedForm, GetFeedFreetsForm,
              RegisterForm, LoginForm},
  mounted() {
    this.$refs.getFreetsForm.submit();
    this.$store.commit('refreshFeeds');
    this.$store.commit('refreshFreets');
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

.welcome {
  color: black;
  text-align: center;
  margin: auto;
  font-size: 2em
}


.signIn * {
    /* display: flex;
    flex-direction: row; */
    text-align: center;
    color: black;
}  

button {
    margin-right: 10px;
}
*{
  font-family: cursive;
}

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  height: auto;
  width: 10%;
}
section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
