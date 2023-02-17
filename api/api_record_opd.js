const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const opd_table = require("./../model/data_opd");

const constance = require("./../constance/constance");
const bcrypt = require("bcryptjs");
//select

router.post("/in", async (req, res) => {
  try {
    let insert_result = await opd_table.create(req.body); //await คือรอให้ส่ง ข้อมูลก่อนจึงตอบ
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});

router.post("/report_raw", async (req, res) => {
  console.log(req.body);

  var command_opd = "";
  var command_plate = "";
  if (req.body.plate_id == "All") {
    command_plate = ``
  } else {
    command_plate = ` and plate_id = '${req.body.plate_id}'`
  }
  if (req.body.opd_name == "All") {
    command_opd = ``
  } else {
    command_opd = ` and opd_category = '${req.body.opd_name}'`
  }
 
  try {
    // const { emp_no } = req.body;
    let dbPassword = await opd_table.sequelize.query(
      `
      SELECT * FROM driver_attendance.data_opds
      where (mfgdate between '${req.body.date_start}' and '${req.body.date_end}')
        ` + command_opd + command_plate +`;`
    );
    res.json({
      result: dbPassword[0],
      api_result: constance.result_ok,
    });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});

//delete
router.patch("/delete", async (req, res) => {
  try {
    let result = await opd_table.destroy({
      where: { id: req.body.id },
    });
    res.json({ result, api_result: constance.result_ok });
    //console.log(result);
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
    //console.log(error);
  }
});
module.exports = router;
