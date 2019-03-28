<template>
  <div>
    <page-title-bar></page-title-bar>
    <app-section-loader :status="loader"></app-section-loader>
    <v-container fluid grid-list-xl pt-0>
      <v-dialog width="600px" persistent v-model="deleteDialog">
        <v-card>
          <v-card-title>
            <h3>Confirm</h3>
          </v-card-title>
          <v-card-text v-if="user != null">Are you sure delete user - {{user.userId}} ?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="deleteDialog = false">Cancel</v-btn>
            <v-btn @click="deleteUser" color="primary">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-layout row wrap v-if="user != null">
        <v-flex xs12 md12 lg12 sm12 class="col-height-auto">
          <div>
            <div class="profile-head app-card mb-30">
              <div class="profile-top">
                <img
                  src="/static/img/profile-banner.jpg"
                  alt="profile banner"
                  width="1920"
                  height="165"
                >
              </div>
              <div class="profile-bottom border-bottom-light-1">
                <div v-if="!editMode">
                  <v-btn color="primary" class="ml-1" @click="editMode = true">
                    <v-icon>edit</v-icon>edit
                  </v-btn>
                  <v-btn color="error" class="ma-1" @click="deleteDialog = true">
                    <v-icon>delete</v-icon>delete
                  </v-btn>
                </div>

                <div v-else>
                  <v-btn class="ma-1" @click="editMode = false">
                    <v-icon>cancel</v-icon>Cancel
                  </v-btn>
                  <v-btn class="ma-1" color="success" @click="save">
                    <v-icon>check</v-icon>Save
                  </v-btn>
                </div>

                <div class="user-image text-xs-center mb-3">
                  <img
                    :src="user.profileUrl"
                    class="img-responsive rounded-circle"
                    alt="user images"
                    v-if="!editMode"
                  >
                  <v-uploader
                    @done="uploadDone"
                    language="en"
                    buttonText="Upload File"
                    :preview-img="user.profileUrl"
                    v-else
                  ></v-uploader>
                </div>
                <div class="user-list-content">
                  <div class="text-xs-center">
                    <div v-if="!editMode">
                      <h3 class="fw-bold">{{user.userId}}</h3>
                      <p>{{user.companyName ? user.companyName : '--'}}</p>
                    </div>
                    <v-layout justify-center align-center column v-else>
                      <v-flex xs2>
                        <v-text-field label="User Id" v-model="user.userId"></v-text-field>
                      </v-flex>
                      <v-flex xs2>
                        <v-text-field label="Company Name" v-model="user.companyName"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </div>
                </div>
              </div>
              <div class="user-activity text-xs-center">
                <ul class="list-inline d-inline-block">
                  <li>
                    <span class="fw-bold">{{user.archerCount}}</span>
                    <span>Archers</span>
                  </li>
                  <li>
                    <span class="fw-bold">{{user.instanceCount}}</span>
                    <span>Instances</span>
                  </li>
                  <li>
                    <span class="fw-bold">{{user.deviceCount}}</span>
                    <span>Devices</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="profile-body">
              <v-layout row wrap>
                <v-flex xs12 md5 lg4 class="col-height-auto">
                  <app-card customClasses="mb-30">
                    <contact-request></contact-request>
                  </app-card>
                  <app-card
                    heading="Education"
                    customClasses="mb-30"
                    :fullScreen="true"
                    :reloadable="true"
                    :closeable="true"
                    :fullBlock="true"
                  >
                    <education></education>
                  </app-card>
                  <app-card
                    heading="skills"
                    customClasses="warning white--text heading-light mb-30"
                    :fullScreen="true"
                    :reloadable="true"
                    :closeable="true"
                    :fullBlock="true"
                  >
                    <skills></skills>
                  </app-card>
                </v-flex>
                <v-flex xs12 md7 lg8>
                  <app-card heading="Activity">
                    <user-activity></user-activity>
                  </app-card>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import UserDetail from "Components/Widgets/UserDetail";
import Skills from "Components/Widgets/Skills";
import Education from "Components/Widgets/Education";
import ContactRequest from "Components/Widgets/ContactRequest";
import UserActivity from "Components/Widgets/UserActivity";
import nodeApi from "Api/node";
export default {
  components: {
    UserDetail,
    Skills,
    Education,
    ContactRequest,
    UserActivity
  },
  data() {
    return {
      id: this.$route.params.userId,
      user: null,
      loader: true,
      editMode: false,
      deleteDialog: false
    };
  },
  mounted() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      const vm = this;
      nodeApi
        .get(`/users/${vm.id}`)
        .then(response => {
          vm.user = response.data;
          console.log(vm.user);
          vm.loader = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    save() {
      const vm = this;
      nodeApi
        .put(`/users/${this.user.id}`, this.user)
        .then(result => {
          vm.editMode = false;
          vm.$toast.success({
            title: "Success",
            message: "Success in update user profile"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteUser() {
      const vm = this;

      nodeApi.delete(`/users/${this.user.id}`).then(result => {
        // window.location = `${window.location.origin}/admin/users`;
        vm.$toast.success({
          title: "Success",
          message: "Success in delete user"
        });
        vm.$router.push({ path: "/users" });
      });
    },
    uploadDone(files) {
      this.user.profileUrl = files[0].url;
      console.log(this.user.profileUrl);
    }
  }
};
</script>
