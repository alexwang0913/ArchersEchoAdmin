<template>
  <div>
    <v-container fluid pt-0 grid-list-xl v-resize="onResize">
      <section-tooltip title="Help Desk" tooltip="HelpDesk Management"></section-tooltip>
      <v-dialog v-model="addAllowArcherDialog" persistent width="800">
        <v-card>
          <v-card-title>
            <h3>Add Allow Archer</h3>
          </v-card-title>
          <v-card-text>
            <span v-if="archers.length < 1">No available archers</span>
            <v-checkbox
              v-model="allowedArcherIds"
              v-for="archer in archers"
              :label="getArcherLabel(archer)"
              :value="archer._id"
              v-else
            ></v-checkbox>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="addAllowArcherDialog = false">close</v-btn>
            <v-btn
              flat
              color="primary"
              @click="saveAllowArchers"
              :loading="saveAllowArcherLoading"
              v-if="archers.length > 0"
            >save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card>
        <v-card-title>
          <h3>Allowed archers</h3>
        </v-card-title>
        <v-card-text>
          <v-btn color="primary" @click="openAllowArcherDialog" :loading="getNoHelpDeskLoading">add</v-btn>
          <v-data-table
            :headers="allowArchersHeader"
            :items="allowedArchers"
            :loading="allowArchersLoading"
            :hide-headers="isMobile"
            :class="{mobile: isMobile}"
          >
            <template slot="items" slot-scope="props">
              <tr v-if="!isMobile">
                <td>{{props.item.name}}</td>
                <td>{{props.item.userId.userId}}</td>
                <td>
                  <v-btn flat icon small color="error" @click="unallowArcher(props.item._id)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr v-else>
                <td>
                  <ul class="flex-content">
                    <li class="flex-item" data-label="Name">{{props.item.name}}</li>
                    <li class="flex-item" data-label="Owner">{{props.item.userId.userId}}</li>
                    <li class="flex-item">
                      <v-btn flat icon small color="error" @click="unallowArcher(props.item._id)">
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </li>
                  </ul>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <app-card
        heading="HelpDesk Tickets"
        colClasses="xs12 mt-2"
        customClasses="mb-0"
        :fullScreen="true"
        :reloadable="true"
        :closeable="true"
        :footer="true"
        :fullBlock="true"
      >
        <support-request></support-request>
        <v-btn slot="footer" color="primary" small>{{$t('message.viewAll')}}</v-btn>
      </app-card>
      <v-card class="mt-2">
        <v-card-title>
          <h3>HelpDesk Tickets</h3>
        </v-card-title>
        <v-card-text>
          <v-list two-line class="card-list">
            <template v-for="(request, index) in supportRequests">
              <v-list-tile :key="index">
                <v-list-tile-content>
                  <v-list-tile-sub-title>
                    <h5 class="mb-1">{{request.title}}</h5>
                    <v-list-tile-action-text class="fw-light">{{request.date}}</v-list-tile-action-text>
                  </v-list-tile-sub-title>
                  <p class="mb-0 fs-12 grey--text">{{request.content}}</p>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-badge v-if="request.status" class="error">Pending</v-badge>
                  <v-badge v-else class="info">Closed</v-badge>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
          <v-data-table
            :headers="helpDeskTicketHeaders"
            :items="helpDeskTickets"
            :loading="helpDeskTicketLoading"
            :hide-headers="isMobile"
            :class="{mobile: isMobile}"
          >
            <template slot="items" slot-scope="props">
              <tr v-if="!isMobile">
                <td>{{props.item._id}}</td>
                <td>{{props.item.openedBy.userId}}</td>
                <td>{{props.item.closedBy}}</td>
                <td>{{props.item.name}}</td>
                <td>{{props.item.openDate.split('T')[0]}}</td>
                <td>{{props.item.closeDate ? props.item.closeDate : '--'}}</td>
                <td>
                  <v-badge class="primary" v-if="props.item.status === 0">Open</v-badge>
                  <v-badge class="cyan" v-if="props.item.status === 1">In Progress</v-badge>
                  <v-badge class="warning" v-if="props.item.status === 2">Waiting</v-badge>
                  <v-badge class="error" v-if="props.item.status === 3">Stopped</v-badge>
                  <v-badge class="success" v-if="props.item.status === 4">Done</v-badge>
                </td>
                <td>
                  <span v-if="props.item.assignedTo.length < 1">No assigned user</span>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import nodeApi from "Api/node";
export default {
  data() {
    return {
      allowedArchers: [],
      allowedArcherIds: [],
      archers: [],
      addAllowArcherDialog: false,
      getNoHelpDeskLoading: false,
      allowArchersLoading: true,
      allowArchersHeader: [
        {
          text: "Name",
          value: "name",
          align: "left"
        },
        {
          text: "Owner",
          value: "owner",
          align: "left"
        },
        {
          text: "",
          value: "action",
          align: "left",
          sortable: false
        }
      ],
      saveAllowArcherLoading: false,
      isMobile: false,
      helpDeskTicketHeaders: [
        {
          text: "Id",
          value: "id",
          align: "left",
          sortable: false
        },
        {
          text: "Opened By",
          value: "openedBy",
          align: "left",
          sortable: false
        },
        {
          text: "Closed By",
          value: "closedBy",
          align: "left",
          sortable: false
        },
        {
          text: "Name",
          value: "name",
          align: "left",
          sortable: false
        },
        {
          text: "Open Date",
          value: "openDate",
          align: "left",
          sortable: false
        },
        {
          text: "Close Date",
          value: "closeDate",
          align: "left",
          sortable: false
        },
        {
          text: "Status",
          value: "status",
          align: "left",
          sortable: false
        },
        {
          text: "Assigned To",
          value: "assignedTo",
          align: "left",
          sortable: false
        }
      ],
      helpDeskTickets: [],
      helpDeskTicketLoading: true
    };
  },
  created() {
    this.getHelpDeskArchers();
    this.getHelpDeskTickets();
  },
  methods: {
    getNoHelpDeskList() {
      nodeApi
        .get("/archer/noHelpDeskList")
        .then(response => {
          this.archers = response.data;
          this.getNoHelpDeskLoading = false;
          this.addAllowArcherDialog = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    openAllowArcherDialog() {
      this.getNoHelpDeskLoading = true;
      this.getNoHelpDeskList();
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
          this.addAllowArcherDialog = false;
          this.getHelpDeskArchers();
        })
        .catch(err => {
          console.log(err);
        });
    },
    getArcherLabel(archer) {
      return archer.name + " (" + archer.userId.userId + ")";
    },
    getHelpDeskArchers() {
      this.allowedArchers = [];
      this.allowArchersLoading = true;
      nodeApi
        .get("/archer/helpDeskList")
        .then(response => {
          this.allowedArchers = response.data;
          this.allowArchersLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    unallowArcher(archerId) {
      if (confirm("Are you sure unallow this archer?")) {
        nodeApi.get(`/archer/unallowHelpDesk/${archerId}`).then(response => {
          this.getHelpDeskArchers();
        });
      }
    },
    onResize() {
      this.isMobile = window.innerWidth < 769 ? true : false;
    },
    getHelpDeskTickets() {
      this.helpDeskTicketLoading = true;
      nodeApi.get("/helpDesk/all").then(response => {
        this.helpDeskTickets = response.data;
        this.helpDeskTicketLoading = false;
      });
    }
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
</style>