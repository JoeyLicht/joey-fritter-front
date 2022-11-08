<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username && $store.state.username === $store.state.preferences.user">
      <header>
        <h2>
          Welcome @{{ $store.state.username }}, You Are Viewing All Freets That Match Your&nbsp <a href="/#/feedPreferences"> Feed Preferences</a>
        </h2>
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
        <h3>No match your preferences.</h3>
      </article>
    </section>
    <section v-else-if="$store.state.username && $store.state.username !== $store.state.preferences.user">
      <header>
        <h2>
          In order to access all of fritter's functionality, you must first select your initial feed settings. You selections are not permanent.
        </h2>
      </header>
      <CreateFeedForm />
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
    // this.$refs.getFreetsForm.submit();
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

main >{
  background-color: black;
}

.welcome, header {
  color: white;
  text-align: center;
  margin: auto;
  font-size: .8em
}


.signIn * {
    /* display: flex;
    flex-direction: row; */
    /* text-align: center; */
    /* color: black; */
}  

button {
    margin-right: 10px;
}
*{
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  height: 5em;
  width: auto;
  filter: invert(100%);
  background-color: transparent;
  margin-top: 2em
}
section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.welcome {
  font-size: 1.4em;
}

a {
  color: white 
}
</style>
