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
        {id: 'politics', label: `Politics (Currently Set to ${this.$store.state.preferences.politics ? 'Yes': 'No'})`, value: this.$store.state.preferences.politics ? 'Yes': 'No' },
        {id: 'comedy', label: `Comedy (Currently Set to ${this.$store.state.preferences.comedy ? 'Yes': 'No'})`, value: this.$store.state.preferences.comedy ? 'Yes': 'No' },
        {id: 'sports', label: `Sports (Currently Set to ${this.$store.state.preferences.sports ? 'Yes': 'No'})`, value: this.$store.state.preferences.sports ? 'Yes': 'No' },
        {id: 'engineering', label: `Engineering (Currently Set to ${this.$store.state.preferences.engineering ? 'Yes': 'No'})`, value: this.$store.state.preferences.engineering ? 'Yes': 'No' },
        {id: 'happy', label: `Happy (Currently Set to ${this.$store.state.preferences.happy ? 'Yes': 'No'})`, value: this.$store.state.preferences.happy ? 'Yes': 'No' },
        {id: 'sad', label: `Sad (Currently Set to ${this.$store.state.preferences.sad ? 'Yes': 'No'})`, value: this.$store.state.preferences.sad ? 'Yes': 'No' }
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