<!-- Device Share Widget -->
<template>
  <div class="device-share-wrap">
    <v-progress-linear :indeterminate="true" color="blue" v-if="isLoading"></v-progress-linear>
    <div v-else>
      <div class="mb-10 pos-relative">
        <doughnut-chart-v2 :height="240"></doughnut-chart-v2>
        <div class="overlay-content d-custom-flex justify-center align-items-center">
          <span class="grey--text font-2x fw-semi-bold">Total: {{totalCount}}</span>
        </div>
      </div>
      <div class="hidden-xs-only">
        <div class="d-custom-flex widget-footer">
          <div class="fs-12 grey--text">
            <span class="v-badge success px-2 py-1"></span>
            <span class="d-block">{{online}}%</span>
            <span class="d-block">Online</span>
          </div>
          <div class="fs-12 grey--text">
            <span class="v-badge error px-2 py-1"></span>
            <span class="d-block">{{offline}}%</span>
            <span class="d-block">Offline</span>
          </div>
          <div class="fs-12 grey--text">
            <span class="v-badge warning px-2 py-1"></span>
            <span class="d-block">{{processNotRunnning}}%</span>
            <span class="d-block">Process not running</span>
          </div>
          <div class="fs-12 grey--text">
            <span class="v-badge grey px-2 py-1"></span>
            <span class="d-block">{{neverCom}}%</span>
            <span class="d-block">Never communicate</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DoughnutChartV2 from "../Charts/DoughnutChartV2";

// constants
import { ChartConfig } from "Constants/chart-config";
import nodeApi from "Api/node";

export default {
  components: {
    DoughnutChartV2
  },
  data() {
    return {
      ChartConfig,
      totalCount: 0,
      online: 0,
      offline: 0,
      processNotRunnning: 0,
      neverCom: 0,
      isLoading: true
    };
  },
  mounted() {
    const vm = this;
    nodeApi.get("/dashboard/deviceOverview").then(response => {
      vm.totalCount =
        response.data[0] +
        response.data[1] +
        response.data[2] +
        response.data[3];
      vm.online = Math.floor((response.data[0] / vm.totalCount) * 100);
      vm.offline = Math.floor((response.data[1] / vm.totalCount) * 100);
      vm.processNotRunnning = Math.floor(
        (response.data[2] / vm.totalCount) * 100
      );
      vm.neverCom = Math.floor((response.data[3] / vm.totalCount) * 100);

      vm.isLoading = false;
    });
  }
};
</script>