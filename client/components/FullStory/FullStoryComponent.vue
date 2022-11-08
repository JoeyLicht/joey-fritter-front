<!-- Reusable component representing a single fullStory and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="fullStory"
  >
    <p
      v-if="displayFull()"  
      class="content"
    >
      {{ viewFullContent() }}
    </p>
    <button 
      v-if="existingFull() && !displayFull()"
      @click="toggleDisplay"
    >
      See Full Story
    </button>
    <button 
      v-if="existingFull() && displayFull()"
      @click="toggleDisplay"
    >
      Hide Full Story
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
  name: 'FullStoryComponent',
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
    existingFull() {
      /**
       * Return if a full story exists for a particular freet
       */
      const allFulls = this.$store.state.fullStories;
      return allFulls.filter(full => full.publishedContent._id === this.freet._id).length === 1;
    },
    displayFull() {
      /**
       * Return true iff a full story exists for a particular freet and its display is set to true
       */
       if (this.existingFull()) {
        const allFulls = this.$store.state.fullStories;
        const displayIds = allFulls.filter(full => full.publishedContent._id === this.freet._id)[0].display; //there will only be one full story
        return displayIds?.includes(this.$store.state.usernameId);
      }
      return false
    },
    viewFullContent() {
      /**
       * Return full story content iff a full story exists for a particular freet
       */
       if (this.existingFull()){
        const allFulls = this.$store.state.fullStories;
        const display = allFulls.filter(full => full.publishedContent._id === this.freet._id)[0].fullStoryContent; //there will only be one full story
        return display
      }
      throw new Error("Can't view full story content on a freet that doesn't have a full story");
    },
    toggleDisplay() {
      /**
       * Toggles the full story display mode
       */

      const params = {
        method: 'PATCH',
        message: 'Successfully toggle full story mode!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.FullStoryRequest(params);
    },
    async FullStoryRequest(params) {
      /**
       * Submits a request to the full story's endpoint
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
        const allFulls = this.$store.state.fullStories;
        const fullId = allFulls.filter(full => full.publishedContent._id === this.freet._id)[0]._id;
        const r = await fetch(`/api/fullStories/${fullId}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshFullStories'); //refresh full Stories

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

.content {
  color: white;
}

textarea, input, button {
  background-color: #606060;
  border-radius: .4em;
  color: white;
  border-color: white;
  border: 1px 
}

input, button {
  border-color: white;
  /* border: 1px solid white */
}

.fullStory, p {
  background-color: #202020;
}

/* button {
  border: 2px solid white;
} */

p {
  background-color: #202020;
  border: 3px solid white;
  border-radius: .4em;
  /* margin-left: 2em; */
  margin-right: 2em;
  padding-left: 10px;
  padding-right: 10px;
  color: white;

}


</style>
