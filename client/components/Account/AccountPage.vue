<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section v-if="$store.state.username">
      <section>
        <header>
          <h2>Account Settings For @{{ $store.state.username }}</h2>
        </header>
        <ChangeUsernameForm />
        <ChangePasswordForm />
      </section>
      <section>
        <header>
          <h2>Account Management</h2>
        </header>
        <LogoutForm />
        <DeleteAccountForm />
      </section>
    </section>
    <section v-else>
      <NotFound />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';
import NotFound from '@/NotFound.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    NotFound
  }
};
</script>


<style scoped>
* {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

header {
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  text-align: center;
  margin-top: 2em;
  margin-bottom: 2em;
}

</style>