// Doughnut Chart Widget
import { Doughnut } from "vue-chartjs";
import { ChartConfig } from "Constants/chart-config";
import nodeApi from "Api/node";
export default {
  extends: Doughnut,
  data() {
    return {
      options: {
        legend: {
          display: false
        },
        cutoutPercentage: 70,
        padding: 20
      },
      data: {},
      ChartConfig
    };
  },
  mounted() {
    // const { labels, data, backgroundColor } = this.data;
    const labels = [
      "Online Devices",
      "Offline Devices",
      "Process not running Devices",
      "Never communicate Devices"
    ];

    const backgroundColor = [
      ChartConfig.color.success,
      ChartConfig.color.danger,
      ChartConfig.color.warning,
      ChartConfig.color.lightGrey
    ];

    const vm = this;
    nodeApi.get("/dashboard/deviceOverview").then(response => {
      const data = response.data;

      vm.renderChart(
        {
          labels,
          datasets: [
            {
              data,
              backgroundColor,
              borderWidth: [0, 0, 0, 0],
              hoverBackgroundColor: backgroundColor
            }
          ]
        },
        vm.options
      );
    });
  }
};
