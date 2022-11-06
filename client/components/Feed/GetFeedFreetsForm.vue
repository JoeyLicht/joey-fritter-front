<!-- Form for getting freets (freet type matches feed preference) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetFeedFreetsForm',
  mixins: [InlineForm],
  data() {
    return {value: this.$store.state.feedFilter};
  },
  methods: {
    async submit() {
      const url = this.value ? `/api/feeds` : '/api/freets';
      try {
        const r = await fetch(url);
        let res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }
 
        res = res.map(r => r.publishedContent);
        // res = res.map(r => r.authorId = 'hi');

        this.$store.commit('updateFeedFilter', this.value);
        this.$store.commit('updateFreets', res);
      } catch (e) {
        if (this.value === this.$store.state.feedFilter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateFilter', null);
          this.value = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshFreets');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.feedFilter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
