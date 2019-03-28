<template>
  <div>
    <app-section-loader :status="loader"></app-section-loader>
    <v-container fluid pt-0 grid-list-xl>
      <section-tooltip title="HelpDesk Ticket Detail" tooltip="HelpDeskTicket Information"></section-tooltip>
      <v-btn flat @click="$router.go(-1)">
        <i class="ti-arrow-left"></i>&nbsp
        back
      </v-btn>
      <v-card>
        <v-card-text v-if="data !== null">
          <v-layout column class="pa-2">
            <span class="caption">
              Id: &nbsp
              <span class="body-1">{{data._id}}</span>
            </span>
            <span class="caption">
              Name: &nbsp
              <span class="body-1">{{data.name}}</span>
            </span>
            <span class="caption">
              Opned by: &nbsp
              <span class="body-1">{{data.openedBy.userId}}</span>
              &nbsp
              Opned at:
              &nbsp
              <span
                class="body-1"
              >{{data.openDate.split('T')[0]}}</span>
            </span>
            <span class="caption">
              Closed by: &nbsp
              <span class="body-1">{{data.closedBy ? data.closedBy.userId : '--'}}</span>
              &nbsp
              Closed at:
              &nbsp
              <span
                class="body-1"
              >{{data.closeDate ? data.closeDate.split('T')[0] : '--'}}</span>
            </span>
            <span class="caption">Description</span>

            <!-- <vue-editor :disabled="true" v-model="data.description"></vue-editor> -->
            <div v-html="data.description" style="border: solid 1px;padding: 2px"></div>
            <span class="caption">
              Status:
              &nbsp
              <v-badge class="primary" v-if="data.status === 0">Open</v-badge>
              <v-badge class="cyan" v-if="data.status === 1">In Progress</v-badge>
              <v-badge class="warning" v-if="data.status === 2">Waiting</v-badge>
              <v-badge class="success" v-if="data.status === 3">Done</v-badge>
            </span>
            <span class="caption">
              Assigned to:
              &nbsp
            </span>
            <v-layout row>
              <v-btn color="primary" v-if="data.status === 0" @click="updateStatus(1)">Start</v-btn>
              <v-btn color="warning" v-if="data.status === 1" @click="updateStatus(2)">Stop</v-btn>
              <v-btn color="cyan" v-if="data.status === 2" @click="updateStatus(1)">Resume</v-btn>
              <v-btn color="error" v-if="data.status < 3" @click="closeTicket">Close</v-btn>
            </v-layout>
            <v-divider></v-divider>
            <span class="caption">Note</span>
            <v-textarea outline v-model="data.note"></v-textarea>
            <v-layout row>
              <v-btn color="primary" @click="saveNote" :loading="noteSaveLoader">save</v-btn>
            </v-layout>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import nodeApi from "Api/node";
import { mapGetters } from "vuex";
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor
  },
  data() {
    return {
      id: this.$route.params.ticketId,
      data: null,
      loader: true,
      noteSaveLoader: false
    };
  },
  created() {
    this.getDetailInfo();
  },
  computed: {
    ...mapGetters(["getUser"])
  },
  mounted() {},
  methods: {
    getDetailInfo() {
      this.loader = true;
      nodeApi
        .get(`/helpDesk/${this.id}`)
        .then(response => {
          this.data = response.data;
          this.loader = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateStatus(status) {
      nodeApi
        .post("/helpDesk/updateStatus", { status: status, id: this.id })
        .then(response => {
          this.$toast.success({
            title: "Congratulations",
            message: "Success in update status"
          });
          this.getDetailInfo();
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveNote() {
      this.noteSaveLoader = true;
      nodeApi
        .post("/helpDesk/saveNote", { id: this.id, note: this.data.note })
        .then(response => {
          this.$toast.success({
            title: "Congratulations",
            message: "Success in update note"
          });
          this.noteSaveLoader = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    closeTicket() {
      nodeApi
        .post("/helpDesk/close", {
          id: this.id,
          closedBy: JSON.parse(this.getUser).data._id
        })
        .then(response => {
          this.$toast.success({
            title: "Congratulations",
            message: "Success in close HelpDesk Ticket"
          });
          this.getDetailInfo();
        });
    }
  }
};
</script>

<style scoped>
</style>