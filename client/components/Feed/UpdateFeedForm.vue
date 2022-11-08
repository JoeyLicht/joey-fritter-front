<!-- Form for updating feeds (block style) -->


<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'UpdateFreedForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/feeds',
      method: 'PATCH',
      hasBody: true,
      fields: [
        {id: 'politics', label: `Politics (Yes/No)`, value: this.$store.state.preferences.politics ? 'Yes': 'No' },
        {id: 'comedy', label: `Comedy (Yes/No)`, value: this.$store.state.preferences.comedy ? 'Yes': 'No' },
        {id: 'sports', label: `Sports (Yes/No)`, value: this.$store.state.preferences.sports ? 'Yes': 'No' },
        {id: 'engineering', label: `Engineering (Yes/No)`, value: this.$store.state.preferences.engineering ? 'Yes': 'No' },
        {id: 'happy', label: `Happy (Yes/No)`, value: this.$store.state.preferences.happy ? 'Yes': 'No' },
        {id: 'sad', label: `Sad (Yes/No)`, value: this.$store.state.preferences.sad ? 'Yes': 'No' }
      ],
      title: 'Update Feed Settings',
      refreshFeeds: true,
      callback: () => {
        const message = 'Successfully updated your feed!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>