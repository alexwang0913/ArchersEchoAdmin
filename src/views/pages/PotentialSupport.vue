<template>
  <div>
    <v-container fluid pt-0 grid-list-xl>
      <section-tooltip title="Potential Support" tooltip="support"></section-tooltip>
      <v-layout row v-resize="onResize">
        <v-flex xs12>
          <v-toolbar flat color="white">
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <v-btn
                slot="activator"
                color="primary"
                @click="onClickAddDialog"
                dark
                class="mb-2"
              >New Item</v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <span class="caption">Select machine type</span>
                        <v-radio-group v-model="editedItem.machineType" row>
                          <v-radio label="CPU" color="primary" value="1"></v-radio>
                          <v-radio label="Memory" color="success" value="2"></v-radio>
                        </v-radio-group>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <span class="caption">Select compare type</span>
                        <v-radio-group v-model="editedItem.compareType">
                          <v-radio label=">" value="1"></v-radio>
                          <v-radio label="<" value="2"></v-radio>
                        </v-radio-group>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.amount" label="Amount (%)"></v-text-field>
                        <v-text-field v-model="editedItem.time" label="Hours"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field v-model="editedItem.recommendation" label="Recommendation"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-data-table
            class="table elevation-1"
            :headers="headers"
            :items="data"
            :hide-headers="isMobile"
            :class="{mobile: isMobile}"
          >
            <template slot="items" slot-scope="props">
              <tr v-if="!isMobile">
                <td>{{props.item.description}}</td>
                <td>{{props.item.recommendation}}</td>
                <td>
                  <v-icon color="primary" small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                  <v-icon color="error" small @click="deleteItem(props.item)">delete</v-icon>
                </td>
              </tr>
              <tr v-else>
                <td>
                  <ul class="flex-content">
                    <li class="flex-item" data-label="Description">{{props.item.description}}</li>
                    <li class="flex-item" data-label="Recommendation">{{props.item.recommendation}}</li>
                    <li>
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
      headers: [
        {
          text: "Description",
          value: "description",
          align: "left",
          sortable: false
        },
        {
          text: "Recommendation",
          value: "Recommendation",
          align: "left",
          sortable: false
        },
        {
          text: "Action",
          value: "Action",
          align: "left",
          sortable: false
        }
      ],
      data: [],
      dialog: false,
      editedIndex: -1,
      editedItem: {
        machineType: "1",
        compareType: "1",
        amount: 0,
        time: 0,
        recommendation: ""
      },
      isMobile: false
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "New PotentialSupport"
        : "Edit PotentialSupport";
    }
  },
  mounted() {
    const vm = this;
    vm.data.push({
      description: "CPU > 90% for 6 hours",
      recommendataion: "Hardware should be optimized or increased."
    });
    vm.getSupportList();
  },
  methods: {
    close() {
      this.dialog = false;
    },
    save() {
      const vm = this;
      if (vm.editedIndex === -1) {
        nodeApi.post("/portential_support", vm.editedItem).then(result => {
          this.$toast.success({
            title: "Congratulations",
            message: "Success in add new portential support"
          });
          vm.getSupportList();
        });
      } else {
        nodeApi
          .put(`/portential_support/${vm.editedIndex}`, vm.editedItem)
          .then(result => {
            this.$toast.success({
              title: "Congratulations",
              message: "Success in update portential support"
            });
            vm.getSupportList();
            vm.editedIndex = -1;
          });
      }

      vm.dialog = false;
    },
    getSupportList() {
      const vm = this;
      nodeApi.get("/portential_support").then(result => {
        vm.data = result.data;
      });
    },
    editItem(item) {
      this.editedIndex = item.id;
      this.editedItem = {
        machineType: item.machineType.toString(),
        compareType: item.compareType.toString(),
        amount: item.amount,
        time: item.time,
        recommendation: item.recommendation
      };

      this.dialog = true;
    },
    onClickAddDialog() {
      this.editedIndex = -1;
      this.editedItem = {
        machineType: "1",
        compareType: "1",
        amount: 0,
        time: 0,
        recommendation: ""
      };
    },
    deleteItem(item) {
      const vm = this;
      if (confirm("Are you sure you want to delete this item?")) {
        nodeApi.delete(`/portential_support/${item.id}`).then(result => {
          this.$toast.success({
            title: "Congratulations",
            message: "Success in delete item"
          });
          vm.getSupportList();
        });
      }
    },
    onResize() {
      this.isMobile = window.innerWidth < 769 ? true : false;
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