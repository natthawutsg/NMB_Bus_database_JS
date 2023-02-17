const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const archive_table = require("./../model/archive_bus");

const constance = require("./../constance/constance");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const fs = require("fs-extra");

router.post("/in", async (req, res) => {
  try {
    let insert_result = await archive_table.create(req.body); //await คือรอให้ส่ง ข้อมูลก่อนจึงตอบ
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});
router.post("/all", async (req, res) => {
  console.log(req.body);
  var command_level = "";
    if (req.body.vender == "All" ) {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {
    let result = await archive_table.sequelize.query(
      `
      SELECT * FROM driver_attendance.achive_buses
      where (date_archive between '${req.body.date_start}'  and '${req.body.date_end}' )  
              ` +
        command_level +
        `
              ; `
    );

    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});

module.exports = router;
