<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div class="right">
      <router-link
        v-if="$store.state.username"
        class="links"
        to="/"
      >
        Feed
      </router-link>
      <router-link
        v-if="$store.state.username && $store.state.username === $store.state.preferences.user"
        class="links"
        to="/createFreet"
      >
        Create Freet
      </router-link>
      <router-link
        v-if="$store.state.preferences.user === $store.state.username"
        class="links"
        to="/feedPreferences"
      >
        Feed Preferences
      </router-link>
      <router-link
        v-if="$store.state.username"
        class="links"
        to="/account"
      >
        Account
      </router-link>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>

nav {
    padding: .2vw 2vw;
    background-color: #606060;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: static;
    border-bottom-left-radius: .4em;
    border-bottom-right-radius: .4em;
}

.title {
    /* font-size: 32px; */
    margin: 0 5px;
}

img {
    height: .12em;
    font-size: 12em;
    filter: invert(100%);
    background-color: transparent;
}

.left {
	display: flex;
	align-items: center;
  gap: 0.25em;
}

.right {
    /* font-size: 1.2em; */
    display: grid;
    gap: 1.3em;
    grid-auto-flow: column;
    align-items: center;
}

/* Change the color of links on hover */
.right a:hover {
  color: white;
  text-decoration: underline;
}

.links {
    text-decoration: none;
}
.right  {
    margin-left: px;
}

* {
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.1em;
  background-color: #606060;
}
.alerts {
    width: 25%;
}
</style>
