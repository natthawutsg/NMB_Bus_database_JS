const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const black_table = require("./../model/black_list");

const constance = require("./../constance/constance");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const fs = require("fs-extra");

router.post("/all_emp", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
    if (req.body.lv == "Admin" ) {
    command_level = ``;
  } else {
    command_level = ` where vender = '${req.body.vender}'`;
  }
  try {
    let result = await black_table.sequelize.query(
      `
          SELECT emp_no FROM driver_attendance.master_rfids
           
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
router.post("/in", async (req, res) => {
  try {
    let insert_result = await black_table.create(req.body); //await คือรอให้ส่ง ข้อมูลก่อนจึงตอบ
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});

router.post("/find_id_card", async (req, res) => {
  try {
    let result = await black_table.sequelize.query(
        `
        SELECT black_lists.emp_no
        ,id_card,detail,on_date
        ,driver_name,vender
         FROM driver_attendance.black_lists
         left join driver_attendance.master_rfids on black_lists.emp_no = master_rfids.emp_no
         where id_card = '${req.body.id_card}'       
              `
      );
  
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    res.json({
      error,
      message: constants.OK,
    });
  }
});
module.exports = router;
