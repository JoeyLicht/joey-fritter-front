<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
      </h3>
      
      <p class="info">
        <button 
          v-if="$store.state.username === freet.author"
          class="delete"
          @click="deleteFreet"
        >
          Delete Freet
        </button> 
        &nbsp {{ formatDate(freet.dateModified) }}
      </p>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value; madeChanges()"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <FullStoryComponent
      class="fullStory"
      :freet="freet"
    />
    <div class="bottom">
      <LikeComponent
        class="like"
        :freet="freet"
      />
      <FreetTypeComponent
        class="freetType"
        :freet="freet"
      /> 
    </div>
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
import LikeComponent from '@/components/Like/LikeComponent.vue';
import FullStoryComponent from '@/components/FullStory/FullStoryComponent.vue';
import FreetTypeComponent from '@/components/FreetType/FreetTypeComponent.vue';

export default {
  name: 'FreetComponent',
  components: {LikeComponent, FullStoryComponent, FreetTypeComponent},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      differentDraft: false, //Whether an edit has been made when freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    formatDate(date) {
      const res = date.split(',');
      return res[0];
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.differentDraft = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    madeChanges() {
      /**
       * Assigns differentDraft boolean if change has been made from original content
       */
      if (this.freet.content !== this.draft) {
        this.differentDraft = true; //change has been made
      }
      else {
        this.differentDraft = false;
      }
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.differentDraft = false;
        this.$store.commit('refreshFreets');
        this.$store.commit('refreshAuthorFreets');

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
    /* border: 1px solid white;
    padding: 20px;
    position: relative; */
  border: 3px solid white;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
  background-color: #202020;
  color: white;
  border-radius: .4em;
}

.like {
  color: red;
  background-color: #202020;
}

textarea, input, button {
  background-color: #606060;
  border-radius: .4em;
  color: white;
  border-color: white;
  border: 1px 
}

header, h3, p {
  background-color: #202020;
}

.content {
  background-color: #202020;
  border: 3px solid white;
  border-radius: .4em;
  margin-left: 2em;
  margin-right: 2em;
  padding-left: 10px;
  padding-right: 10px;
  color: white;
}

.info {
  display: flex;
  align-items: row;
  justify-content: space-between;
  align-items: center;
}
.fullStory {
  margin-left: 2em;
  margin-top: 1px;
}

input, button {
  border-color: white;
  /* border: 1px solid white */
}

header, .bottom {
  display: flex;
  align-items: row;
  justify-content: space-between;
  align-items: center;
  color: white;
  background-color: #202020;
  margin-left: 2em;
  margin-right: 2em
}

article {
  background-color: white;
}

</style>
