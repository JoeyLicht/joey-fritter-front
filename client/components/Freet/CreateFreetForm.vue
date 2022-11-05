<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFreetForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/freets',
      fullStoryURL: '/api/fullStories',
      freetTypeURL: '/api/freetTypes',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content (Required, 140 character limit)', value: ''},
        {id: 'fullStoryContent', label: 'Full Story (Optional, 1,000 word limit)', value: ''},
        {id: 'freetTypeLabel', label: 'Freet Content Category (Required: Politics, Comedy, Sports, Engineering, Happy, Sad)', value: ''}
      ],
      title: 'Create a freet',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
