const { default: axios } = require("axios");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const moment = require("moment");
const port = process.env.PORT || 3000;
// const { getDoc, doc } = require("firebase/firestore");
// const { signInWithEmailAndPassword } = require("firebase/auth");
// const { auth, db } = require("./fbase");

// 공공데이터포털로부터 국경일, 공휴일 fetch
const url_rest =
  "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";

const year = moment().year();
const nextYear = year + 1;
const data = {};
let queryParams = `?${encodeURIComponent("serviceKey")}=${
  process.env.DATA_GO_KR_SERVICE_KEY
}`; // Service key
queryParams += `&${encodeURIComponent("_type")}=json`; // Data type
queryParams += `&${encodeURIComponent("numOfRows")}=100`; // # of rows to fetch at once
queryThisYear = `${queryParams}&${encodeURIComponent("solYear")}=${year}`; // This Year
queryNextYear = `${queryParams}&${encodeURIComponent("solYear")}=${nextYear}`; // Next Year

axios.get(url_rest + queryThisYear).then((res) => {
  const list = res.data.response.body.items.item;
  list.forEach(({ dateName, locdate }, index) => {
    if (dateName === "부처님오신날") dateName = "석가탄신일";
    else if (dateName === "기독탄신일") dateName = "크리스마스";
    data[locdate] = dateName;
  });
});

axios.get(url_rest + queryNextYear).then((res) => {
  const list = res.data.response.body.items.item;
  list.forEach(({ dateName, locdate }, index) => {
    if (dateName === "부처님오신날") dateName = "석가탄신일";
    else if (dateName === "기독탄신일") dateName = "크리스마스";
    data[locdate] = dateName;
  });
});

app.get("/", cors(), (req, res) => {
  res.send(data);
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
