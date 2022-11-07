<!-- Form for creating freets with full story -->

<script>
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';

export default {
  name: 'CreateFreetWithFullForm',
  mixins: [CreateFreetForm],
  data() {
    return {
      fullStoryURL: '/api/fullStories',
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'fullStoryContent', label: 'Full Story', value: ''},
        {id: 'freetTypeLabel', label: 'Freet Content Category (Politics, Comedy, Sports, Engineering, Happy, Sad)', value: ''}
      ],
      title: 'Create a full story freet',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a freet with a full story!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
