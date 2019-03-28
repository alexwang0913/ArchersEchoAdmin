<template>
  <div>
    <v-container fluid pt-0 grid-list-xl>
      <section-tooltip title="HelpDesk Ticket" tooltip="HelpDeskTicket Management"></section-tooltip>
      <v-layout row>
        <app-card
          heading="Allowed Archers"
          colClasses="xl6 lg6 md6 sm6 xs12"
          :fullScreen="true"
          :reloadable="true"
          :closeable="true"
          :fullBlock="true"
        >
          <allowed-archer></allowed-archer>
        </app-card>

        <app-card
          heading="HelpDeskTicket List"
          colClasses="lg6 md6  sm12 xs12"
          customClasses="mb-0"
          :fullScreen="true"
          :reloadable="true"
          :closeable="true"
          :fullBlock="true"
        >
          <help-desk-ticket></help-desk-ticket>
        </app-card>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import allowedArcher from "./AllowedArcher";
import helpDeskTicket from "./HelpDeskTicket";
export default {
  components: {
    allowedArcher,
    helpDeskTicket
  }
};
</script>

<style scoped>
</style>