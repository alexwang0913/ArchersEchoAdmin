<template>
  <div>
    <v-container fluid pt-0 grid-list-xl>
      <section-tooltip title="Windows EventLog" tooltip="WindowsEventLog"></section-tooltip>
      <v-layout row>
        <v-flex xs12>
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" persistent max-width="500px">
              <v-btn
                slot="activator"
                color="primary"
                @click="onClickAddDialog"
                dark
                class="mb-2 text-capitalize"
              >Add</v-btn>
              <v-card>
                <v-card-title>
                  <span
                    class="headline"
                  >{{dialogType ? 'Add windows event log' : 'Edit windows event log'}}</span>
                </v-card-title>

                <v-card-text>
                  <v-container grid-list-md>
                    <ul
                      class="red--text"
                      v-if="errors.length > 0"
                    >You need to check the following errors
                      <li v-for="(error, idx) in errors">{{error}}</li>
                    </ul>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-text-field label="Event ID" v-model="eventLog.eventId"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Priority" v-model="eventLog.priority"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Summary" v-model="eventLog.summary"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat @click="closeDialog">Close</v-btn>
                  <v-btn flat color="primary" @click="save" :loading="saveBtnLoading">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-data-table
            class="table"
            :headers="headers"
            :items="eventLogs"
            :rows-per-page-items="[10, 25]"
            :loading="isLoading"
            :hide-headers="isMobile"
            :class="{mobile: isMobile}"
            v-resize="onResize"
          >
            <template slot="items" slot-scope="props">
              <tr v-if="!isMobile">
                <td>{{props.item.eventId}}</td>
                <td>{{props.item.priority}}</td>
                <td>{{props.item.summary}}</td>
                <td>
                  <v-icon color="primary" small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                  <v-icon color="error" small @click="deleteItem(props.item)">delete</v-icon>
                </td>
              </tr>
              <tr v-else>
                <td>
                  <ul class="flex-content">
                    <li class="flex-item" data-label="Event ID">{{props.item.eventId}}</li>
                    <li class="flex-item" data-label="Priority">{{props.item.priority}}</li>
                    <li class="flex-item1" data-label="Summary">{{props.item.summary}}</li>
                    <li class="flex-item">
                      <v-icon color="primary" small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                      <v-icon color="error" small @click="deleteItem(props.item)">delete</v-icon>
                    </li>
                  </ul>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import nodeApi from "Api/node";
export default {
  data() {
    return {
      dialog: false,
      dialogType: true, //true: add, false: edit
      isLoading: true,
      headers: [
        {
          text: "Event ID",
          value: "eventId",
          align: "left",
          sortable: false
        },
        {
          text: "Priority",
          value: "priority",
          align: "left",
          sortable: false
        },
        {
          text: "Summary",
          value: "summary",
          align: "left",
          sortable: false
        },
        {
          text: "",
          value: "action",
          align: "left",
          sortable: false
        }
      ],
      eventLogs: [],
      errors: [],
      eventLog: {},
      saveBtnLoading: false,
      isMobile: false
    };
  },
  methods: {
    onClickAddDialog() {
      this.dialog = true;
      this.dialogType = true;
      this.eventLog = {};
    },
    closeDialog() {
      this.dialog = false;
    },
    save() {
      const vm = this;
      if (!vm.validateForm()) return;
      vm.saveBtnLoading = true;

      if (vm.dialogType) {
        nodeApi.post("/eventLog", this.eventLog).then(result => {
          vm.saveBtnLoading = false;
          vm.$toast.success({
            title: "Congratulations!",
            message: "Success in add event log"
          });
          vm.getWindowsEventLogList();
          vm.dialog = false;
        });
      } else {
        nodeApi
          .put(`/eventLog/${vm.eventLog._id}`, vm.eventLog)
          .then(result => {
            vm.saveBtnLoading = false;
            vm.$toast.success({
              title: "Congratulations!",
              message: "Success in edit event log"
            });
            vm.getWindowsEventLogList();
            vm.dialog = false;
          });
      }
    },
    validateForm() {
      if (
        this.eventLog.eventId &&
        this.eventLog.priority &&
        this.eventLog.summary
      ) {
        return true;
      }
      this.errors = [];
      if (!this.eventLog.eventId) {
        this.errors.push("Event Id required");
      }
      if (!this.eventLog.priority) {
        this.errors.push("Priority required");
      }
      if (!this.eventLog.summary) {
        this.errors.push("Summary required");
      }
      return false;
    },
    getWindowsEventLogList() {
      const vm = this;
      this.isLoading = true;
      nodeApi.get("/eventLog").then(result => {
        vm.eventLogs = result.data;
        this.isLoading = false;
      });
    },
    editItem(item) {
      // console.log("edit item:__");
      // console.log(item);
      this.dialog = true;
      this.dialogType = false;
      this.eventLog = item;
    },
    deleteItem(item) {
      // console.log("delete item: __");
      // console.log(item);
      if (confirm("Are you sure delete this item?")) {
        const vm = this;
        nodeApi.delete(`/eventLog/${item._id}`).then(result => {
          vm.$toast.success({
            title: "Congratulations",
            message: "Success in remove windows event log"
          });
          vm.getWindowsEventLogList();
        });
      }
    },
    onResize() {
      this.isMobile = window.innerWidth < 769 ? true : false;
    }
  },
  mounted() {
    this.getWindowsEventLogList();
  }
};
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .mobile table.v-table tr {
    max-width: 100%;
    position: relative;
    display: block;
  }

  .mobile table.v-table tr:nth-child(odd) {
    border-left: 6px solid deeppink;
  }

  .mobile table.v-table tr:nth-child(even) {
    border-left: 6px solid cyan;
  }

  .mobile table.v-table tr td {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
    height: auto;
    padding: 10px;
  }

  .mobile table.v-table tr td ul li:before {
    content: attr(data-label);
    padding-right: 0.5em;
    text-align: left;
    display: block;
    color: #999;
  }
  .v-datatable__actions__select {
    width: 50%;
    margin: 0px;
    justify-content: flex-start;
  }
  .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
    background: transparent;
  }
}
.flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.flex-item {
  padding: 5px;
  width: 50%;
  height: 40px;
  font-weight: bold;
}
.flex-item1 {
  padding: 5px;
  width: 100%;
  height: auto;
  font-weight: bold;
}
</style>