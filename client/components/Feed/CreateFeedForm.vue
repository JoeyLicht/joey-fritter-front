<!-- Form for creating feeds (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFeedForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/feeds',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'politics', label: 'Politics (Yes/No)', value: ''},
        {id: 'comedy', label: 'Comedy (Yes/No)', value: ''},
        {id: 'sports', label: 'Sports (Yes/No)', value: ''},
        {id: 'engineering', label: 'Engineering (Yes/No)', value: ''},
        {id: 'happy', label: 'Happy (Yes/No)', value: ''},
        {id: 'sad', label: 'Sad (Yes/No)', value: ''}
      ],
      title: 'Customize your feed',
      refreshFeeds: true,
      callback: () => {
        const message = 'Successfully customized your feed!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
