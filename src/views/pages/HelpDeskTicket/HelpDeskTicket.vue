<template>
  <div>
    <app-section-loader :status="loader"></app-section-loader>
    <vue-perfect-scrollbar style="height:500px" :settings="settings">
      <v-list two-line class="card-list">
        <template v-for="(ticket, index) in helpDeskTickets">
          <v-list-tile :key="index">
            <v-list-tile-action>
              <v-badge class="primary" v-if="ticket.status === 0">Open</v-badge>
              <v-badge class="cyan" v-if="ticket.status === 1">In Progress</v-badge>
              <v-badge class="warning" v-if="ticket.status === 2">Waiting</v-badge>
              <v-badge class="error" v-if="ticket.status === 3">Stopped</v-badge>
              <v-badge class="success" v-if="ticket.status === 4">Done</v-badge>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-sub-title>
                <h5 class="mb-1">{{ticket.name}}</h5>
                <v-list-tile-action-text class="fw-light">
                  Opened by
                  <span class="grey--text font-weight-bold">{{ticket.openedBy.userId}}</span>
                  at
                  <span
                    class="grey--text font-weight-bold"
                  >{{ticket.openDate.split('T')[0]}}</span>
                </v-list-tile-action-text>
                <br>
                <v-list-tile-action-text class="fw-light">
                  Closed by
                  <span
                    class="grey--text font-weight-bold"
                  >{{ticket.closedBy ? ticket.closedBy.userId : '--'}}</span>
                  at
                  <span
                    class="grey--text font-weight-bold"
                  >{{ticket.closeDate ? ticket.closeDate.split('T')[0] : '--'}}</span>
                </v-list-tile-action-text>
                <p class="mb-0 fs-12 grey--text">Assigned members: {{ticket.assignedTo.length}}</p>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <div class="d-custom-flex">
                <a class="mr-3 ripple" @click="gotoDetail(ticket._id)">
                  <i class="zmdi zmdi-eye primary--text"></i>
                </a>
                <a class="mr-3" @click="onDeleteHelpDesk(ticket._id)">
                  <i class="zmdi zmdi-delete error--text"></i>
                </a>
              </div>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
      <delete-confirmation-dialog
        ref="deleteConfirmationDialog"
        heading="Are You Sure You Want To Delete?"
        message="Are you sure you want to delete helpdesk ticket?"
        @onConfirm="deleteHelpDesk"
      ></delete-confirmation-dialog>
    </vue-perfect-scrollbar>
  </div>
</template>
<script>
import api from "Api";
import nodeApi from "Api/node";
export default {
  data() {
    return {
      loader: true,
      supportRequests: [],
      settings: {
        maxScrollbarLength: 160
      },
      helpDeskTickets: [],
      selectedTicketId: null
    };
  },
  mounted() {
    // this.getSupportRequests();
    this.getHelpDeskTickets();
  },
  methods: {
    getSupportRequests() {
      api
        .get("vuely/supportRequests.js")
        .then(response => {
          this.loader = false;
          this.supportRequests = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getHelpDeskTickets() {
      nodeApi
        .get("/helpDesk/all")
        .then(response => {
          this.loader = false;
          this.helpDeskTickets = response.data;
          console.log(this.helpDeskTickets);
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteHelpDesk() {
      nodeApi.delete(`/helpDesk/${this.selectedTicketId}`).then(response => {
        this.$toast.success({
          title: "Congratulations",
          message: "Success in delete HelpDesk Ticket"
        });
      });
    },
    onDeleteHelpDesk(ticketId) {
      this.selectedTicketId = ticketId;
      this.$refs.deleteConfirmationDialog.openDialog();
    },
    gotoDetail(ticketId) {
      console.log(ticketId);
      this.$router.push({ path: `/helpdeskDetail/${ticketId}` });
    }
  }
};
</script>