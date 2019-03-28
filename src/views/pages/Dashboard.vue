<template>
  <div>
    <v-container fluid pt-0 grid-list-xl>
      <section-tooltip :title="$t('message.overview')" :tooltip="$t('message.dashboardOverview')"></section-tooltip>
      <!-- Dash Cards -->
      <v-layout row wrap border-rad-sm overflow-hidden>
        <v-flex class="xl4 lg4 md4 sm6 xs12">
          <div class="app-card">
            <v-card-text>
              <v-progress-linear :indeterminate="true" color="blue" v-if="isLoading"></v-progress-linear>
              <div class="layout justify-space-between pa-3" v-else>
                <div class="align-item-start">
                  <h3 class="fw-bold mb-1">
                    <countTo :startVal="0" :endVal="data.deviceCount" :duration="5000"></countTo>
                  </h3>
                  <p class="ma-0 fs-12 grey--text">Total Devices</p>
                </div>
              </div>
            </v-card-text>
          </div>
        </v-flex>
        <v-flex class="xl4 lg4 md4 sm6 xs12">
          <div class="app-card">
            <v-card-text>
              <v-progress-linear :indeterminate="true" color="blue" v-if="isLoading"></v-progress-linear>
              <div class="layout justify-space-between pa-3" v-else>
                <div class="align-item-start">
                  <h3 class="fw-bold mb-1">
                    <countTo :startVal="0" :endVal="data.userCount" :duration="5000"></countTo>
                  </h3>
                  <p class="ma-0 fas-12 grey--text">Total Users</p>
                </div>
              </div>
            </v-card-text>
          </div>
        </v-flex>
      </v-layout>

      <!-- Sales -->
      <v-layout row wrap>
        <!-- Devices Share -->
        <app-card
          colClasses="xl4 lg5 md5 sm6 xs12"
          heading="Device Overview"
          :fullScreen="true"
          :reloadable="true"
          :closeable="true"
          customClasses="device-share-widget"
        >
          <device-share></device-share>
        </app-card>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// charts component
import LineChartShadow from "Components/Charts/LineChartShadow";
import Sales from "Components/Charts/SalesChartV2";
import LineChartWithArea from "Components/Charts/LineChartWithArea";
import countTo from "vue-count-to";

// widgets
import RecentSale from "Components/Widgets/RecentSales";
import SupportRequest from "Components/Widgets/SupportRequestV2";
import ToDoList from "Components/Widgets/ToDoList";
import Invoice from "Components/Widgets/Invoice";
import RecentOrders from "Components/Widgets/RecentOrders";
import WeeklySales from "Components/Widgets/WeeklySales.vue";
import Reviews from "Components/Widgets/Reviews";
import SocialFeeds from "Components/Widgets/SocialFeeds";
import TopSelling from "Components/Widgets/TopSelling";
import NewPost from "Components/Widgets/AddNewBlog";
import BlogLayoutOne from "Components/Widgets/BlogLayoutOne";
import BlogLayoutFour from "Components/Widgets/BlogLayoutFour";
import CategorySale from "Components/Widgets/CategorySales";
import DeviceShare from "Components/Widgets/DeviceShare";

import { ChartConfig } from "Constants/chart-config";
import nodeApi from "Api/node";
export default {
  components: {
    LineChartShadow,
    RecentSale,
    SupportRequest,
    Sales,
    ToDoList,
    Invoice,
    RecentOrders,
    CategorySale,
    LineChartWithArea,
    WeeklySales,
    Reviews,
    SocialFeeds,
    TopSelling,
    NewPost,
    BlogLayoutOne,
    BlogLayoutFour,
    DeviceShare,
    countTo
  },
  data() {
    return {
      blog: {
        id: 3,
        thumbnail: "/static/img/blog-3.jpg",
        title: "lorem ipsum is simply dummy text",
        body:
          "Consectetur adipisicing elit. Ullam expedita, necessitatibus sit exercitationem aut quo quos inventore similique nulla minima distinctio illo iste dignissimos vero nostrum, magni pariatur delectus natus.",
        date: "1-jun-2018"
      },
      ChartConfig,
      labels: ["A", "B", "C", "D", "E", "F", "J", "K", "L", "M", "N", "P"],
      totalEarnings: [30, 50, 25, 55, 44, 60, 30, 20, 40, 20, 40, 44],
      onlineRevenue: [30, 50, 25, 55, 44, 60, 30, 20, 40, 20, 40, 44],
      newCustomers: [30, 50, 25, 55, 44, 60, 30, 20, 40, 20, 40, 44],
      data: {
        deviceCount: 0,
        userCount: 0
      },
      isLoading: true
    };
  },
  mounted() {
    this.getOverview();
  },
  methods: {
    getOverview() {
      const vm = this;
      nodeApi.get("/dashboard").then(result => {
        vm.data = result.data;
        vm.isLoading = false;
      });
    }
  }
};
</script>
