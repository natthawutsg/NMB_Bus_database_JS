const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const archive_table = require("./../model/archive_driver");

const constance = require("./../constance/constance");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const fs = require("fs-extra");
const request = require("request");

//https://engineering.thinknet.co.th/%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%88%E0%B9%89%E0%B8%87%E0%B9%80%E0%B8%95%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%94%E0%B9%89%E0%B8%A7%E0%B8%A2-line-notify-670f9b20ac27

router.post("/shoot", async (req, res) => {
  var axios = require("axios");
  var qs = require("qs");
  var data = qs.stringify({
    message: req.body.message1+ "\n" +req.body.message2,
  });
  var config = {
    method: "post",
    url: "https://notify-api.line.me/api/notify",
    headers: {
      Authorization: "Bearer n5bCPOrk39UbwbTLnVaTC6WjCFYrrykfYwarC84EQSc",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  res.json({ api_result: constance.result_ok });
});
module.exports = router;
