<template>
  <div class="session-wrapper">
    <div class="session-left">
      <!-- <session-slider-widget></session-slider-widget> -->
    </div>
    <div class="session-right text-xs-center">
      <div class="session-table-cell">
        <div class="session-content">
          <img :src="appLogo" class="img-responsive mb-3" width="78" height="78">
          <h2 class="mb-3">{{$t('message.loginToAdmin')}}</h2>
          <p
            class="fs-14"
          >{{$t('message.enterUsernameAndPasswordToAccessControlPanelOf')}} {{brand}}.</p>
          <v-form v-model="valid" class="mb-4">
            <v-text-field label="User ID" v-model="userId" required></v-text-field>
            <v-text-field
              label="Password"
              v-model="password"
              type="password"
              :rules="passwordRules"
              required
            ></v-text-field>
            <v-checkbox color="primary" label="Remember me" v-model="checkbox"></v-checkbox>
            <router-link
              class="mb-1"
              to="/session/forgot-password"
            >{{$t('message.forgotPassword')}}?</router-link>
            <div>
              <v-btn large @click="submit" block color="primary">{{$t('message.loginNow')}}</v-btn>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import SessionSliderWidget from "Components/Widgets/SessionSlider";
import AppConfig from "Constants/AppConfig";

import AuthService from "../../auth/AuthService";

const auth = new AuthService();
const { login, logout, authenticated, authNotifier } = auth;

export default {
  components: {
    SessionSliderWidget
  },
  data() {
    return {
      checkbox: false,
      valid: false,
      userId: "",
      password: "",
      passwordRules: [v => !!v || "Password is required"],
      appLogo: AppConfig.appLogo2,
      brand: AppConfig.brand
    };
  },
  methods: {
    submit() {
      const user = {
        userId: this.userId,
        password: this.password
      };
      this.$store.dispatch("signinUserInAdmin", {
        user
      });
    }
  }
};
</script>
