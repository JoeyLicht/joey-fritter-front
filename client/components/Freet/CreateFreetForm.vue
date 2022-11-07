<!-- Form for creating freets -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <label 
          v-if="field.id === 'content'" 
        >
          {{ field.label }} ({{ inputCharacters(field.value) }} / {{ contentLimit }} characters)
        </label>
        <label 
          v-else-if="field.id === 'fullStoryContent' && fullStoryInput"
        >
          {{ field.label }} ({{ inputWords(field.value) }} / {{ fullStoryLimit }} words)
        </label>
        <label 
          v-else-if="field.id === 'fullStoryContent' && !fullStoryInput"
        >
          {{ field.label }} (Access 1,0000 additional words and collapsable content?)
        </label>
        <label 
          v-if="field.id === 'fullStoryContent'"
          class="switch"
        >
          <input type="checkbox" @click="toggleFullStory">
          <div class="slider round"></div>
        </label>
        <label v-if="field.id === 'freetTypeLabel'">
          {{ field.label }}
        </label>
        <textarea
          v-if="field.id === 'content' || (field.id === 'fullStoryContent' && fullStoryInput)"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <!-- <button
          v-if="field.id === 'fullStoryContent' && fullStoryInput"
          type="button"  
          @click="toggleFullStory"
        >
          Do not need Full Story
        </button> -->
        <!-- <button
          v-if="field.id === 'fullStoryContent' && !fullStoryInput"
          type="button"  
          @click="toggleFullStory"
        >
          Access more than 140 characters and collapsable content?
        </button> -->
        <input
          v-if="field.id === 'freetTypeLabel'"
          :type="'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        >
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button
      type="submit"
    >
      {{ title }}
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
  </form>
</template>

<script>

export default {
  name: 'CreateFreetForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '/api/freets', // Url to submit form to
      method: 'POST', // Form request method
      hasBody: true, // Whether or not form request has a body
      refreshFreets: true, // Whether or not stored freets should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      fullStoryURL: '/api/fullStories', //Freet Type Url to submit to
      full: '', //content of full story, useful for error checking before freet is created
      freetTypeURL: '/api/freetTypes', //Freet Type Url to submit to
      freetType: '', //freet type string
      contentLimit: 140, //content character limit
      fullStoryLimit: 1000, //full story limit
      fullStoryInput: true, //by default full story does appear
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'fullStoryContent', label: 'Full Story', value: ''},
        {id: 'freetTypeLabel', label: 'Freet Content Category (Politics, Comedy, Sports, Engineering, Happy, Sad)', value: ''}
      ],
      title: 'Create a freet',
      callback: () => {
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }

    };
  },
  methods: {
    toggleFullStory() {
      /**
       * Toggle this.fullStoryInput
       */
      this.fullStoryInput = ! this.fullStoryInput;
    },
    inputCharacters(input) {
      /**
       * Returns character length of input (input of all spaces counts as 0)
       */
      if (!input.trim()){
        return 0
      }
      return input.length;
    },
    inputWords(input) {
      /**
       * Returns word length of input (input of all spaces counts as 0)
       */
      if (!input.trim()){
        return 0
      }
      return input.split(' ').filter(word => word !== '').length;
    },
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };

      if (this.fullStoryInput) {
          this.full = this.fields
                            .filter(field => {
                                    const {id, value} = field;
                                    return id === 'fullStoryContent';
                                  })
                            .map(field => {
                                    const {id, value} = field;
                                    return value;
                                  })
      }

      if (this.freetTypeURL.length) {
          this.freetType = this.fields
                            .filter(field => {
                                    const {id, value} = field;
                                    return id === 'freetTypeLabel';
                                  })
                            .map(field => {
                                    const {id, value} = field;
                                    return value;
                                  })
      }

      if (this.hasBody) {
        options.body = JSON.stringify(Object.fromEntries(
          this.fields.map(field => {
            const {id, value} = field;
            // field.value = ''; //we will only clear at the end after a success
            return [id, value];
          })
        ));
      }

      try {
        if (this.fullStoryInput) { //check for full story errors before creating the freet
          if (this.full.toString().split(' ').length > 1000) {
            throw new Error(`Full Story Content must be less than 1,000 words. Currently it is words ${this.full.toString().split(' ').length}`)
          }
        }

        if (this.freetTypeURL.length) { //check for full story errors before creating the freet
          const valid = ['Politics', 'Comedy', 'Sports', 'Engineering', 'Happy', 'Sad'];
          if (! valid?.includes(this.freetType.toString())) {
            throw new Error(`Freet Content Category must be one of the preselected categories`)
          }
        }
        
        const r = await fetch(this.url, options);
        const res = await r.json();

        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          throw new Error(res.error);
        }

        if (this.fullStoryInput) { //create a full story
          const rFull = await fetch(`${this.fullStoryURL}/${res.freet._id}`, options);
          this.$store.commit('refreshFullStories');
          if (!rFull.ok) {
            const res = await rFull.json();
            throw new Error(res.error);
          }
        }

        if (this.freetTypeURL.length) { //create a freet type
          const rType = await fetch(`${this.freetTypeURL}/${res.freet._id}`, options);
          this.$store.commit('refreshFreetTypes');
          if (!rType.ok) {
            const res = await rType.json();
            throw new Error(res.error);
          }
        }

        if (this.refreshFreets) {
          this.fields.map(field => field.value = '');

        } else if (this.refreshFeeds) {
          this.$store.commit('refreshFeeds');
        }

        this.$store.commit('refreshFreets');
        this.$store.commit('refreshAuthorFreets');
        this.$store.commit('refreshLikes');
        this.$store.commit('refreshFullStories');
        this.$store.commit('refreshFreetTypes');

      if (this.callback) {
        this.callback();
      }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea, input {
   font-family: inherit;
   font-size: inherit;
}

/* Switch per: https://codepen.io/EssSaibot/pen/zZmZbP


/* The switch - the box around the slider */
body {
  text-align: center;
  background: #51C3A0; 
  padding: 50px
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background-color: #ccc; */
  background-color: black;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #ccc
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>