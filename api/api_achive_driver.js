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

router.post("/in", async (req, res) => {
  try {
    let result = await archive_table.sequelize.query(
      `
      INSERT INTO driver_attendance.achive_drivers (date_archive,date_record,emp_no,rfid,driver_name,plate_id,vender,employ_date,birth_date,license_date,remark)
      SELECT '${req.body.date_archive}',DATE_FORMAT(NOW(),'%Y-%m-%d') ,master_rfids.emp_no,rfid,driver_name,plate_id,vender,employ_date,birth_date,license_date,'${req.body.remark}'
      FROM driver_attendance.master_rfids
      left join driver_attendance.master_drivers 
      on driver_attendance.master_rfids.emp_no = driver_attendance.master_drivers.emp_no
      WHERE master_rfids.emp_no = '${req.body.emp_no}'
              ; `
    );
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
      SELECT * FROM driver_attendance.achive_drivers
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
