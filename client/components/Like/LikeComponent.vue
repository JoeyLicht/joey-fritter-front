<!-- Reusable component representing a single like and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="like"
  >
    <p class="info">
      TODO IN Component Number Likes: {{ numberLikes }}
    </p>
    <button 
      v-if="$store.state.username !== freet.author"
      @click="addLike"
    >
      🧡   Like: TODO
    </button>
    <button 
      v-if="$store.state.username !== freet.author"
      @click="removeLike"
    >
      💔   Unlike: TODO
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
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      numberLikes: this.numLikes(),
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    numLikes() {
      /**
       * Return number of likes for a particular freet
       */
      // const url = `/api/likes/${this.freet._id}`;
      // const res = await fetch(url).then(async r => r.json());
      // return res.length;
      return Math.floor(Math.random() * 10)
    },
    addLike() { //TODOOO make sure to refresh like count
      /**
       * Creates a like for a freet made by user
       */

      //TODO error user has already liked in the past

      if (this.$store.state.username === this.freet.author) {
        const error = 'Error: Cannot react to own freet';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'POST',
        message: 'Successfully liked freet!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.LikeRequest(params);
    },
    removeLike() { //TODOOO make sure to refresh like count
      /**
       * Creates a like for a freet made by user
       */

       //TODO error if user has not already liked freet

      if (this.$store.state.username === this.freet.author) {
        const error = 'Error: Cannot react to own freet';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'DELETE',
        message: 'Successfully unliked freet!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.LikeRequest(params);
    },
    async LikeRequest(params) { //TODO--make sure to refresh likes
      /**
       * Submits a request to the like's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/likes/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        // this.editing = false;
        // this.differentDraft = false;
        // this.$store.commit('refreshLikes');
        this.numberLikes = this.numLikes();

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
      
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
