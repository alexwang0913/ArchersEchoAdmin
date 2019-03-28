<template>
  <div>
    <v-container fluid pt-0 grid-list-xl>
      <section-tooltip title="Rule" tooltip="Rule management"></section-tooltip>
      <v-btn
        class="text-capitalize"
        color="primary"
        @click="() => {this.dialog=true, this.dialogMode = 1, this.rule = {}}"
      >
        <v-icon>add</v-icon>Add new rule
      </v-btn>
      <v-dialog persistent v-model="dialog" width="700">
        <v-card>
          <v-card-title class="headline">{{dialogMode === 1 ? 'Add new rule' : 'Edit rule'}}</v-card-title>
          <v-card-text>
            <v-form>
              <v-layout column v-if="errors.length">
                <b class="red--text">Please correct the following error(s):</b>
                <ul>
                  <li v-for="error in errors">{{error}}</li>
                </ul>
              </v-layout>
              <v-container>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field v-model="rule.name" label="Rule name"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="() => {this.dialog=false}">Close</v-btn>
            <v-btn flat color="primary" @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-layout column v-resize="onResize">
        <v-flex xs12>
          <v-data-table
            class="table elevation-1"
            :headers="headers"
            :items="rules"
            :hide-headers="isMobile"
            :class="{mobile: isMobile}"
          >
            <template slot="items" slot-scope="props">
              <tr v-if="!isMobile">
                <td>{{props.item.name}}</td>
                <td>{{props.item.createdAt.replace('T', ' ').split('.')[0]}}</td>
                <td>
                  <v-icon color="primary" small class="mr-2" @click="editRule(props.item)">edit</v-icon>
                  <v-icon color="error" small @click="deleteRule(props.item._id)">delete</v-icon>
                </td>
              </tr>
              <tr v-else>
                <td>
                  <ul class="flex-content">
                    <li class="flex-item" data-label="Rule Name">{{props.item.name}}</li>
                    <li
                      class="flex-item"
                      data-label="Created At"
                    >{{props.item.createdAt.replace('T', '').split('.')[0]}}</li>
                    <li class="flex-item">
                      <v-icon color="primary" small class="mr-2" @click="editRule(props.item)">edit</v-icon>
                      <v-icon color="error" small @click="deleteRule(props.item._id)">delete</v-icon>
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
      rule: {},
      headers: [
        {
          text: "Rule Name",
          value: "ruleName",
          align: "left",
          sortable: false
        },
        {
          text: "Created At",
          value: "createdAt",
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
      rules: [],
      errors: [],
      dialogMode: 1, // 1: add 2: edit
      isMobile: false
    };
  },
  mounted() {
    this.getRuleList();
  },
  methods: {
    save() {
      const vm = this;
      if (!vm.checkForm()) return;
      if (vm.dialogMode === 1) {
        nodeApi.post("/rule", vm.rule).then(response => {
          vm.$toast.success({
            title: "Success",
            message: "Success in add rule"
          });
          vm.dialog = false;
          vm.rule = {};
          vm.getRuleList();
        });
      } else if (vm.dialogMode === 2) {
        nodeApi.put(`/rule/${vm.rule._id}`, vm.rule).then(response => {
          vm.$toast.success({
            title: "Success",
            message: "Success in edit rule"
          });
          vm.dialog = false;
          vm.rule = {};
          vm.getRuleList;
        });
      }
    },
    checkForm() {
      if (this.rule.name) {
        return true;
      }
      this.errors = [];

      if (!this.rule.name) {
        this.errors.push("Rule name required");
      }
      return false;
    },
    getRuleList() {
      const vm = this;
      nodeApi.get("/rule").then(response => {
        console.log(response);
        vm.rules = response.data;
      });
    },
    editRule(item) {
      this.dialogMode = 2;
      this.rule = item;
      this.dialog = true;
    },
    deleteRule(ruleId) {
      const vm = this;
      if (confirm("Are you sure delete this rule?")) {
        nodeApi.delete(`/rule/${ruleId}`).then(response => {
          vm.$toast.success({
            title: "Success",
            message: "Success in delete rule"
          });
          vm.getRuleList();
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