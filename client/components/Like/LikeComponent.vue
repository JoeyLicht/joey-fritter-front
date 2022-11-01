<!-- Reusable component representing a single like and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="like"
  >
    <button 
      v-if="$store.state.username !== freet.author && ! existingLike()"
      @click="addLike"
    >
      ♡ {{ numLikes() }}
    </button>
    <button 
      v-if="$store.state.username !== freet.author && existingLike()"
      @click="removeLike"
    >
      ♥ {{ numLikes() }}
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
  name: 'LikeComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    numLikes() {
      /**
       * Return number of likes for a particular freet
       */
      const allLikes = this.$store.state.likes
      return allLikes.filter(like => like.publishedContent._id === this.freet._id).length;
    },
    existingLike() {
      /**
       * Return if user has liked freet
       */
      const allLikes = this.$store.state.likes
      const exists = allLikes
                       .filter(like => like.userLiking === this.$store.state.username)
                       .filter(filtered =>  filtered.publishedContent._id === this.freet._id)
                       .length === 1;
      return exists;
    },
    addLike() {
      /**
       * Creates a user like for a freet (freet must be authored by another user)
       */

      if (this.$store.state.username === this.freet.author) {
        const error = 'Error: Cannot react to own freet';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      if (this.existingLike()) {
        const error = 'Error: Cannot like a freet multiple times';
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
    removeLike() {
      /**
       * Removes a user like (Unlike) for a freet (freet must be authored by another user)
       */

      if (this.$store.state.username === this.freet.author) {
        const error = 'Error: Cannot react to own freet';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      if (! this.existingLike()) {
        const error = 'Error: Cannot unlike a freet you do not currently like';
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
    async LikeRequest(params) {
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

        this.$store.commit('refreshLikes'); //refresh number of likes

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
