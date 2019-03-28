<template>
  <div>
    <page-title-bar></page-title-bar>
    <app-section-loader :status="loader"></app-section-loader>
    <v-container fluid pt-0 grid-list-xl>
      <v-layout align-center justify-center column>
        <v-uploader
          @done="uploadDone"
          language="en"
          buttonText="Upload XML File"
          :preview="false"
          :uploadFileUrl="uploadUrl"
          :beforeUpload="beforeUpload"
        ></v-uploader>

        <v-layout row>
          <v-btn
            color="primary"
            :disabled="uploadLoading"
            :loading="convertLoading"
            @click="convert"
          >Convert</v-btn>

          <!-- <v-btn
            color="warning"
            :disabled="uploadLoading"
            :loading="convertLoading"
            @click="exportXml"
          >export</v-btn>-->
        </v-layout>

        <v-card class="mx-auto" width="800">
          <v-card-text>
            <ul>
              <tree-item
                v-for="(item, idx) in treeData"
                :key="idx"
                class="item"
                :item="item"
                @make-folder="makeFolder"
                @add-item="addItem"
              ></tree-item>
            </ul>
          </v-card-text>
        </v-card>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import nodeApi from "Api/node";
export default {
  data() {
    return {
      loader: false,
      uploadLoading: false,
      xmlUrl: "",
      treeData: [],
      convertLoading: false,
      uploadUrl: "http://localhost:3000/api/upload/xml"
      // uploadUrl:
      //   "http://ec2-18-191-197-111.us-east-2.compute.amazonaws.com/api/upload/xml"
    };
  },
  computed: {},
  methods: {
    uploadDone(files) {
      // console.log("Upload finish");
      this.xmlUrl = files[0].url;
      this.uploadLoading = false;
      this.$toast.success({
        title: "Congratulations",
        message: "Success in upload XML file"
      });
    },
    beforeUpload() {
      // console.log("Before file upload");
      this.uploadLoading = true;
      return true;
    },
    makeFolder: function(item) {
      Vue.set(item, "children", []);
      this.addItem(item);
    },
    addItem: function(item) {
      item.children.push({
        name: "new stuff"
      });
    },
    convert() {
      const data = {
        url: this.xmlUrl
      };
      this.convertLoading = true;
      this.treeData = [];
      nodeApi
        .post("/convert", data)
        .then(response => {
          // console.log("Success in convert XML");
          // console.log(response);
          this.convertLoading = false;
          this.treeData = response.data;
        })
        .catch(err => {
          // console.log("Failed in convert XML");
          // console.log(err);
          this.convertLoading = false;
        });
    },
    exportXml() {
      const data = {
        xmlUrl: this.xmlUrl,
        structure: this.treeData
      };
      nodeApi
        .post("/convert/export", data)
        .then(response => {
          console.log("success in export data");
          console.log(response);
        })
        .catch(err => {
          console.log("Failed in export data");
        });
    }
  }
};
</script>

<style scoped>
ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
</style>