<template>
  <!-- <div>
    <v-container fluid pt-0 grid-list-xl>
      <section-tooltip :title="$t('message.overview')" :tooltip="$t('message.dashboardOverview')"></section-tooltip>
      <v-btn class="text-capitalize" color="primary" @click="() => {this.dialog=true}">
        <v-icon>add</v-icon>Add New user
      </v-btn>
      <v-dialog persistent v-model="dialog" width="700">
        <v-card>
          <v-card-title class="headline">Add new user</v-card-title>
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
                    <v-text-field v-model="user.userId" label="User Name"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="user.companyName" label="Company Name"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="user.password" label="Password" type="password"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      v-model="user.confirmPassword"
                      label="Confirm password"
                      type="password"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="() => {this.dialog=false}">Close</v-btn>
            <v-btn flat color="primary" @click="addUser">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog persistent v-model="deleteDialog" width="700">
        <v-card>
          <v-card-title class="headline">Confirm</v-card-title>
          <v-card-text>
            <h3>Are you sure delete @{{user.userId}}?</h3>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="() => {this.deleteDialog=false}">No</v-btn>
            <v-btn flat color="primary" @click="deleteUser">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-layout column>
        <v-flex xs12>
          <v-data-table class="table elevation-1" :headers="headers" :items="users">
            <template slot="items" slot-scope="props">
              <td>
                <img src="/static/avatars/user-9.jpg" class="rounded-circle img-responsive" width="70" height="70">
              </td>
              <td class="d-custom-flex align-items-center">{{props.item.userId}}</td>
              <td>{{props.item.companyName}}</td>
              <td>{{props.item.createdAt}}</td>
              <td>{{props.item.deviceActivatedAt}}</td>
              <td>
                <v-btn
                  color="primary text-capitalize"
                  @click="updateUser(props.item)"
                  v-if="!props.item.isActive"
                >Active</v-btn>
                <v-btn
                  color="warning text-capitalize"
                  @click="updateUser(props.item)"
                  v-if="props.item.isActive"
                >Deactivate</v-btn>
                <v-btn color="error text-capitalize" @click="onClickDeleteUser(props.item)">Delete</v-btn>
              </td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
  </div>-->
  <div>
    <page-title-bar></page-title-bar>
    <app-section-loader :status="loader"></app-section-loader>
    <v-container fluid grid-list-xl pt-0>
      <v-btn color="primary" @click="openAddUserDialog">
        <v-icon>add</v-icon>add new user
      </v-btn>
      <v-dialog persistent v-model="dialog" width="700">
        <v-card>
          <v-card-title class="headline">Add new user</v-card-title>
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
                    <v-text-field v-model="user.userId" label="User Name"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="user.companyName" label="Company Name"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <h2>Password Strength</h2>
                    <ul>
                      <li v-bind:class="{ is_valid: contains_eight_characters }">8 Characters</li>
                      <li v-bind:class="{ is_valid: contains_number }">Contains Number</li>
                      <li v-bind:class="{ is_valid: contains_uppercase }">Contains Uppercase</li>
                      <li
                        v-bind:class="{ is_valid: contains_special_character }"
                      >Contains Special Character</li>
                    </ul>
                    <div
                      class="checkmark_container"
                      v-bind:class="{ show_checkmark: valid_password }"
                    >
                      <svg width="50%" height="50%" viewBox="0 0 140 100">
                        <path
                          class="checkmark"
                          v-bind:class="{ checked: valid_password }"
                          d="M10,50 l25,40 l95,-70"
                        ></path>
                      </svg>
                    </div>

                    <input
                      type="password"
                      @input="checkPassword"
                      v-model="user.password"
                      autocomplete="off"
                      placeholder="Password"
                    >

                    <!-- <v-text-field v-model="user.password" label="Password" type="password"></v-text-field> -->
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="() => {this.dialog=false}">Close</v-btn>
            <v-btn flat color="primary" @click="addUser" :loading="saveLoading">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-layout row wrap v-if="usersList !== null">
        <app-card colClasses="xs12 sm6 md4" v-for="(users, index) in usersList" :key="index">
          <div class="user-image text-xs-center mb-3">
            <img
              :src="users.profileUrl"
              class="img-responsive rounded-circle"
              alt="user images"
              width="95"
              height="95"
            >
          </div>
          <div class="user-list-content">
            <div class="text-xs-center">
              <h3
                class="fw-bold"
                style="cursor: pointer;"
                @click="gotoProfilePage(users._id)"
              >{{users.userId}}</h3>
              <p>{{ users.companyName ? users.companyName : '--' }}</p>
            </div>
            <div class="layout column border-tb-1 mb-3">
              <div class="layout row justify-space-between pa-2 mt-1 ml-1 mr-1">
                <div class="align-item-start">
                  <span>Create date:</span>
                </div>
                <div class="align-item-end">
                  <span>{{users.createdAt ? users.createdAt.split('T')[0] : '--'}}</span>
                </div>
              </div>
              <div class="layout row justify-space-between pa-2 mb-1 ml-1 mr-1">
                <div class="align-item-start">
                  <span>Active date:</span>
                </div>
                <div class="align-item-end">
                  <span>{{users.activatedAt ? users.activatedAt.split('T')[0] : '--'}}</span>
                </div>
              </div>
            </div>
            <v-btn
              class="btn-success white--text ma-0 text-capitalize"
              href="javascript:void(0);"
              @click="updateStatus(users)"
              v-if="users.isActive"
            >Deactive</v-btn>
            <v-btn
              class="btn-danger white--text ma-0 text-capitalize"
              href="javascript:void(0);"
              @click="updateStatus(users)"
              v-else
            >active</v-btn>
          </div>
        </app-card>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import nodeApi from "Api/node";
import { users } from "../../store/modules/chat/data";
import api from "Api";
export default {
  data() {
    return {
      headers: [
        {
          text: "",
          value: "avatar",
          align: "left",
          sortable: false
        },
        {
          text: "User Name",
          value: "UserName",
          align: "left",
          sortable: false
        },
        {
          text: "Company Name",
          vlaue: "companyName",
          align: "left",
          sortable: false
        },
        {
          text: "Signup Date",
          value: "signupDate",
          align: "left",
          sortable: false
        },
        {
          text: "Device Activate Date",
          value: "deviceActivateDate",
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
      dialog: false,
      user: {},
      errors: [],
      deleteDialog: false,
      loader: true,
      usersList: null,
      connectUsersList: null,
      password: null,
      password_length: 0,
      contains_eight_characters: false,
      contains_number: false,
      contains_uppercase: false,
      contains_special_character: false,
      valid_password: false,
      saveLoading: false
    };
  },
  mounted() {
    this.getUserList();
    // this.getUsers();
    // this.getConnections();
  },
  methods: {
    getUserList() {
      this.loader = true;
      nodeApi
        .get("/users")
        .then(response => {
          this.usersList = response.data;
          this.loader = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateStatus(user) {
      const data = {
        status: !user.isActive,
        id: user._id
      };
      const vm = this;
      vm.updateStatusLoading = true;
      nodeApi
        .post("/users/updateStatus", data)
        .then(result => {
          vm.$toast.success({
            title: "Success",
            message: "Success in update status"
          });
          vm.getUserList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    onClickDeleteUser(user) {
      this.user = user;
      this.deleteDialog = true;
    },
    deleteUser() {
      const vm = this;

      nodeApi.delete(`/users/${this.user._id}`).then(user => {
        vm.getUserList();
        vm.$toast.success({
          title: "Success",
          message: "Success in delete user"
        });
        vm.deleteDialog = false;
      });
    },
    addUser() {
      if (!this.checkForm()) return;
      const vm = this;
      vm.saveLoading = true;
      nodeApi.post("/users", vm.user).then(response => {
        vm.$toast.success({
          title: "Congratulations",
          message: "Success in add user"
        });
        vm.saveLoading = false;
        vm.dialog = false;
        vm.user = {};
        vm.getUserList();
      });
    },
    checkForm() {
      if (
        this.user.userId &&
        this.user.companyName &&
        this.user.password &&
        this.valid_password
      ) {
        return true;
      }
      this.errors = [];

      if (!this.user.userId) {
        this.errors.push("User name required");
      }

      if (!this.user.companyName) {
        this.errors.push("Company name required");
      }

      if (!this.user.password) {
        this.errors.push("Password required");
      }

      if (!this.valid_password) {
        this.errors.push("Password is weak.");
      }

      return false;
    },
    getImgSrc(connectedUsers) {
      if (this.connectUsersList) {
        for (var i = 0; i < this.connectUsersList.length; i++) {
          var user = this.connectUsersList[i];
          if (connectedUsers === user.id) {
            return user.img;
          }
        }
      }
    },
    getUsers() {
      api
        .get("vuely/users.js")
        .then(response => {
          this.loader = false;
          this.usersList = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getConnections() {
      api
        .get("vuely/connections.js")
        .then(response => {
          this.connectUsersList = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoProfilePage(id) {
      this.$router.push({ path: `/userProfile/${id}` });
    },
    checkPassword() {
      this.password_length = this.user.password.length;
      const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

      if (this.password_length > 8) {
        this.contains_eight_characters = true;
      } else {
        this.contains_eight_characters = false;
      }

      this.contains_number = /\d/.test(this.user.password);
      this.contains_uppercase = /[A-Z]/.test(this.user.password);
      this.contains_special_character = format.test(this.user.password);

      if (
        this.contains_eight_characters === true &&
        this.contains_special_character === true &&
        this.contains_uppercase === true &&
        this.contains_number === true
      ) {
        this.valid_password = true;
      } else {
        this.valid_password = false;
      }
    },
    openAddUserDialog() {
      this.dialog = true;
      this.contains_eight_characters = false;
      this.contains_number = false;
      this.contains_uppercase = false;
      this.contains_special_character = false;
    }
  }
};
</script>

<style scoped>
ul {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

li {
  margin-bottom: 8px;
  color: #525f7f;
  position: relative;
}

li:before {
  content: "";
  width: 0%;
  height: 2px;
  background: #2ecc71;
  position: absolute;
  left: 0;
  top: 50%;
  display: block;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Password Input --------- */

.input_container {
  position: relative;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  background: #fff;
}

input[type="password"] {
  line-height: 1.5;
  display: block;
  color: rgba(136, 152, 170, 1);
  font-weight: 300;

  height: calc(2.75rem + 2px);
  padding: 0.625rem 0.75rem;
  border-radius: 0.25rem;
  background-color: #fff;
  transition: border-color 0.4s ease;
  border: 1px solid #cad1d7;
  outline: 0;
}

input[type="password"]:focus {
  border-color: rgba(50, 151, 211, 0.45);
}

/* Checkmark & Strikethrough --------- */

.is_valid {
  color: rgba(136, 152, 170, 0.8);
}
.is_valid:before {
  width: 100%;
}

.checkmark_container {
  border-radius: 50%;

  top: -15px;
  right: -15px;
  background: #2ecc71;
  width: 50px;
  height: 50px;
  visibility: hidden;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.4s ease;
}

.show_checkmark {
  visibility: visible;
  opacity: 1;
}

.checkmark {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: white;
  stroke-width: 15;
  stroke-linecap: round;
  stroke-dasharray: 180;
  stroke-dashoffset: 180;
}

.checked {
  animation: draw 0.5s ease forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>