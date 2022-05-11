import axios from "axios";

//URL to API

export default axios.create({
  baseURL: "http://localhost:5000",
  headers: { "Content-type": "application/json" },
});
