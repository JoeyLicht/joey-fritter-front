<!-- Reusable component representing a single freet type and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freetType"
  >
    <p
      v-if="existingFreetType()"  
      class="content"
    >
      {{ getType() }}
    </p>
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
  name: 'FreetTypeComponent',
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
    existingFreetType() {
      /**
       * Return if a freet type exists for a particular freet
       */
      const allTypes = this.$store.state.freetTypes;
      return allTypes.filter(type => type.publishedContent._id === this.freet._id).length === 1;
    },
    getType() {
      /**
       * Returns the type for the freet if one exists
       */

      const allTypes = this.$store.state.freetTypes;
      return allTypes.filter(type => type.publishedContent._id === this.freet._id)[0].freetTypeLabel;
    }
  }
};
</script>

<style scoped>

p, .freetType {
  background-color: #202020;
}

</style>
