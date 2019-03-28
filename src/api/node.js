import axios from "axios";

export default axios.create({
  // baseURL: "http://localhost:3000/api/"
  // baseURL: "https://statusreport-test.herokuapp.com/api/"
  baseURL: "http://ec2-18-191-197-111.us-east-2.compute.amazonaws.com/api"
});
