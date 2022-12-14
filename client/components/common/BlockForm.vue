<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

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
        <label :for="field.id">{{ field.label }}:</label>
        <textarea
          v-if="field.id === 'content' || field.id === 'fullStoryContent'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <!-- <div v-else-if="['politics', 'comedy', 'sports', 'engineering', 'happy', 'sad'].includes(field.id)">
          <button
            v-if="field.value === 'Yes'"
            type="button"
            @input="field.value = 'No'"
          >
            Change to No
          </button>
          <button
            v-else
            type="button"
            @input="field.value = 'Yes'"
          >
            Change to Yes
          </button>
        </div> -->
        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
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
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
      refreshFeeds: false, // Whether or not stored feeds should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
      fullStoryURL: '', //Freet Type Url to submit to
      full: '', //content of full story, useful for error checking before freet is created
      freetTypeURL: '', //Freet Type Url to submit to
      freetType: '' //freet type string
    };
  },
  methods: {
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };

      if (this.fullStoryURL.length) {
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
        if (this.setUsername) {
          const r = await fetch(this.url, options);
          if (!r.ok) {
            // If response is not okay, we throw an error and enter the catch block
            const res = await r.json();
            throw new Error(res.error);
          }
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
          this.$store.commit('setUsernameId', res.user ? res.user._id : null);
        }

        else if (this.refreshFreets || this.refreshFeeds){ //this means we are creating a freet
          if (this.fullStoryURL.length) { //check for full story errors before creating the freet
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

          if (this.fullStoryURL.length) { //create a full story
            const rFull = await fetch(`${this.fullStoryURL}/${res.freet._id}`, options);
            this.$store.commit('refreshFullStories');
            if (!rFull.ok) {
              const res = await rFull.json();
              throw new Error(res.error);
            }
          }

          if (this.freetTypeURL.length) { //create a freet type
            // const freet = await r.json();
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
            this.$store.commit('refreshPreferences');
            this.$store.commit('refreshFeeds');
          }

        }

        this.$store.commit('refreshFreets');
        this.$store.commit('refreshAuthorFreets');
        this.$store.commit('refreshLikes');
        this.$store.commit('refreshFullStories');
        this.$store.commit('refreshFreetTypes');
        this.$store.commit('refreshPreferences');
        this.$store.commit('refreshFeeds');

        if (this.callback) {
          this.callback();
        }

        if (this.refreshFeeds){ //take user back to home page after updating their preferences
          setTimeout(() => this.$router.push('/'), 1000);
          // this.$router.push('/');
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

button {
  border: 3px solid white
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

.alerts p {
  border-radius: .4em;
}

h3 {
  text-align: center;
}

h3, label, p, div {
  background-color: #202020;
}

textarea, input {
   font-family: inherit;
   font-size: inherit;
}
</style>
