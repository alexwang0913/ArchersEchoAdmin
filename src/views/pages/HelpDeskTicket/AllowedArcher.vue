<template>
  <div>
    <app-section-loader :status="loader"></app-section-loader>
    <vue-perfect-scrollbar style="height: 500px" :settings="settings">
      <v-list class="card-list list-aqua-ripple todo-list" v-if="archerList !== null" two-line>
        <v-list-tile v-for="(item, index) in archerList" :key="index" href="javascript:;" ripple>
          <v-list-tile-content>
            <v-list-tile-title>
              <h5>{{item.name}}</h5>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              <span class="fs-12">Owner: {{item.userId.userId}}</span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-btn fab dark small color="error" @click="onUnallowHelpDesk(item)" class="trash-icon">
            <v-icon class="zmdi zmdi-delete"></v-icon>
          </v-btn>
        </v-list-tile>
      </v-list>
    </vue-perfect-scrollbar>
    <delete-confirmation-dialog
      ref="deleteConfirmationDialog"
      heading="Are You Sure You Want To Delete?"
      message="Are you sure you want to unallow helpdesk ticket?"
      @onConfirm="unallowHelpDesk"
    ></delete-confirmation-dialog>
    <v-dialog class="pa-2" v-model="dialog" max-width="500px">
      <v-btn color="primary" small slot="activator" @click="getUnAllowedArchers">
        <i class="material-icons">add</i>add
      </v-btn>
      <v-card>
        <v-card-title>
          <h3>Add Allow Archer</h3>
        </v-card-title>
        <v-card-text>
          <v-progress-linear :indeterminate="true" v-if="archersLoading"></v-progress-linear>
          <div v-else>
            <span v-if="unallowedArchers.length < 1">No available archers</span>
            <v-checkbox
              v-model="allowedArcherIds"
              v-for="archer in unallowedArchers"
              :label="getArcherLabel(archer)"
              :value="archer._id"
              v-else
            ></v-checkbox>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="dialog = false">close</v-btn>
          <v-btn
            color="warning"
            @click="saveAllowArchers"
            :loading="saveAllowArcherLoading"
            v-if="unallowedArchers.length > 0"
          >save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import nodeApi from "Api/node";

export default {
  data() {
    return {
      loader: true,
      settings: {
        maxScrollbarLength: 100
      },
      archerList: null,
      selectItem: null,
      dialog: false,
      allowedArcherIds: [],
      unallowedArchers: [],
      saveAllowArcherLoading: false,
      archersLoading: true
    };
  },
  created() {
    this.getAllowedArchers();
  },
  methods: {
    onUnallowHelpDesk(item) {
      this.$refs.deleteConfirmationDialog.openDialog();
      this.selectItem = item;
    },
    unallowHelpDesk() {
      nodeApi
        .get(`/archer/unallowHelpDesk/${this.selectItem._id}`)
        .then(response => {
          this.getAllowedArchers();
          this.$refs.deleteConfirmationDialog.close();
        });
    },
    getAllowedArchers() {
      this.loader = true;
      nodeApi
        .get("/archer/helpDeskList")
        .then(response => {
          this.archerList = response.data;
          this.loader = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getUnAllowedArchers() {
      this.archersLoading = true;
      nodeApi
        .get("/archer/noHelpDeskList")
        .then(response => {
          this.unallowedArchers = response.data;
          this.archersLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveAllowArchers() {
      this.saveAllowArcherLoading = true;
      nodeApi
        .post("/archer/allowHelpDesk", this.allowedArcherIds)
        .then(response => {
          this.$toast.success({
            title: "Congratulations",
            message: "Success in allow HelpDesk Ticket"
          });
          this.saveAllowArcherLoading = false;
          this.dialog = false;
          this.getAllowedArchers();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getArcherLabel(archer) {
      return archer.name + " (" + archer.userId.userId + ")";
    }
  }
};
</script>

<style scoped>
</style>