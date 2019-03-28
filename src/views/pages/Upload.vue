<template>
  <div>
    <v-container fluid pt-0>
      <app-card
        colClasses="xs12 sm12 md12 lg12"
        :fullScreen="true"
        :reloadable="true"
        :closeable="true"
        customClasses="blog-widget"
      >
        <v-uploader
          @done="uploadDone"
          language="en"
          buttonText="Upload File"
          :preview="false"
          :uploadFileUrl="uploadUrl"
        ></v-uploader>
      </app-card>
    </v-container>
    <v-data-table
      class="table elevation-1"
      :headers="headers"
      :items="data"
      v-resize="onResize"
      :hide-headers="isMobile"
      :class="{mobile: isMobile}"
    >
      <template slot="items" slot-scope="props">
        <tr v-if="!isMobile">
          <td>{{props.item.name}}</td>
          <td>{{props.item.createdAt.replace('T', ' ').split('.')[0]}}</td>
          <td>
            <v-icon color="error" small @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </tr>
        <tr v-else>
          <td>
            <ul class="flex-content">
              <li class="flex-item" data-label="Url">{{props.item.name}}</li>
              <li
                class="flex-item"
                data-label="Upload Time"
              >{{props.item.createdAt.replace('T', '').split('.')[0]}}</li>
              <li class="flex-item">
                <v-icon color="error" small @click="deleteItem(props.item)">delete</v-icon>
              </li>
            </ul>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Dropzone from "vue2-dropzone";
import nodeApi from "Api/node";
export default {
  components: {
    Dropzone
  },
  data() {
    return {
      headers: [
        {
          text: "Url",
          value: "url",
          align: "left",
          sortable: false
        },
        {
          text: "Upload Time",
          value: "uploadTime",
          align: "left",
          sortable: false
        },
        {
          text: "Action",
          value: "action",
          align: "left",
          sortable: false
        }
      ],
      data: [],
      // uploadUrl: "http://localhost:3000/api/upload"
      uploadUrl:
        "http://ec2-18-191-197-111.us-east-2.compute.amazonaws.com/api/upload"
    };
  },
  methods: {
    getFileList() {
      const vm = this;
      nodeApi.get("/file_uploads").then(result => {
        vm.data = result.data;
      });
    },
    deleteItem(item) {
      const vm = this;
      if (confirm("Are you sure delete this item?")) {
        nodeApi.delete(`/file_uploads/${item._id}`).then(result => {
          vm.getFileList();
        });
      }
    },
    uploadDone(files) {
      const vm = this;
      vm.$toast.success({
        title: "Congratulations",
        message: "Success in fileupload"
      });
      nodeApi.post("/file_uploads", { name: files[0].url }).then(result => {
        vm.getFileList();
      });
    },
    onResize() {
      this.isMobile = window.innerWidth < 769 ? true : false;
    }
  },
  mounted() {
    this.getFileList();
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
  width: 100%;
  height: auto;
  font-weight: bold;
}
</style>