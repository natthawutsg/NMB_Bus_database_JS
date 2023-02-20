const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const rfid_table = require("./../model/master_card");
const bus_table = require("./../model/master_bus_text");
const constance = require("./../constance/constance");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const fs = require("fs-extra");
//select
router.post("/all", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` where master_rfids.vender = '${req.body.vender}'`;
  }
  try {
    let result = await rfid_table.sequelize.query(
      `
      SELECT id,rfid,master_rfids.emp_no,driver_name,plate_id,vender,employ_date
      ,birth_date,TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age
     FROM driver_attendance.master_rfids left join driver_attendance.master_drivers on master_rfids.emp_no = master_drivers.emp_no
         
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
router.post("/all_finder", async (req, res) => {
  console.log(req.body);

  // lv: localStorage.getItem(key.USER_LV),
  // vender: localStorage.getItem(key.USER_VENDER),
  // finder: this.state.emp_name_find,
  // vender_find: this.state.vender_name_find,
  var command_level = "";
  var command_vender = "";
  var command_finder = "";
  if (req.body.lv == "Admin") {
    command_level = ` `;
  } else {
    command_level = ` and master_rfids.vender = '${req.body.vender}'`;
  }
  if ( req.body.vender_find == "All") {
    command_vender = ` `;
  } else {
    command_vender = ` and master_rfids.vender = '${req.body.vender_find}'`;
  }
  if ( req.body.finder == "" ||req.body.finder == "All" ) {
    command_finder = ` `;
  } else {
    command_finder = ` 
    where  emp_no like '%${req.body.finder}%'
    or driver_name like '%${req.body.finder}%'
    or plate_id like '%${req.body.finder}%'`;
  }
  try {
    let result = await rfid_table.sequelize.query(
      `with tb1 as(
        SELECT id,rfid,master_rfids.emp_no,driver_name,plate_id,vender,employ_date
        ,birth_date,TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age
       FROM driver_attendance.master_rfids left join driver_attendance.master_drivers on master_rfids.emp_no = master_drivers.emp_no
       where rfid <> ''` +
        command_level +
        command_vender +
        `
 )       
 select id,rfid,emp_no,driver_name,plate_id,vender,employ_date,birth_date,age 
 from tb1` +
 command_finder+
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
    let insert_result = await rfid_table.create(req.body); //await คือรอให้ส่ง ข้อมูลก่อนจึงตอบ
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});
router.patch("/del", async (req, res) => {
  try {
    let result = await rfid_table.destroy({
      where: { emp_no: req.body.emp_no },
    });
    res.json({ result, api_result: constance.result_ok });
    //console.log(result);
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
    //console.log(error);
  }
});
router.post("/find_rfid", async (req, res) => {
  try {
    const { rfid } = req.body;
    let dbPassword = await rfid_table.findOne({ where: { rfid } });

    if (dbPassword == null) {
      // if not found
      res.json({
        result: "rfid_not_found",
        api_result: constance.result_nok,
      });
    } else {
      // if found

      res.json({
        result: dbPassword,
        api_result: constance.result_ok,
      });
    }
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/find_emp", async (req, res) => {
  try {
    const { emp_no } = req.body;
    let dbPassword = await rfid_table.findOne({ where: { emp_no } });

    if (dbPassword == null) {
      // if not found
      res.json({
        result: "emp_no_not_found",
        api_result: constance.result_nok,
      });
    } else {
      // if found

      res.json({
        result: dbPassword,
        api_result: constance.result_ok,
      });
    }
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/in_new", async (req, res) => {
  console.log("/in_new");

  try {
    const form = new formidable.IncomingForm();

    var pic_type;
    var pic_data;

    form.parse(req, async (error, fields, files) => {
      if (files.pic1 == undefined) {
        pic_type = "";
        pic_data = "";
        // check_pic = "no";
      } else {
        pic_type = files.pic1.type;
        pic_data = fs.readFileSync(files.pic1.path);
        // check_pic = "yes";
      }

      var data = {
        rfid: fields.rfid,
        emp_no: fields.emp_no,
        driver_name: fields.driver_name,
        plate_id: fields.plate_id,
        vender: fields.vender,
        employ_date: fields.employ_date,
        picType1: pic_type,
        pic1: pic_data,
      };

      let result = await rfid_table.create(data);
      res.json({ result, api_result: constance.result_ok });
      console.log(result);
    });
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
router.get("/picture/:emp_no", async (req, res) => {
  try {
    const { emp_no } = req.params;
    let result = await rfid_table.findOne({
      where: { emp_no: emp_no },
    });
    res.type(result.picType1);
    res.end(result.pic1);
  } catch (error) {
    res.json({
      error,
      message: constants.OK,
    });
  }
});
router.put("/update", async (req, res) => {
  console.log("/update_pic");

  try {
    const form = new formidable.IncomingForm();

    var pic_type;
    var pic_data;

    form.parse(req, async (error, fields, files) => {
      if (files.pic1 == undefined) {
        pic_type = "";
        pic_data = "";
        // check_pic = "no";
      } else {
        pic_type = files.pic1.type;
        pic_data = fs.readFileSync(files.pic1.path);
        // check_pic = "yes";
      }

      var data = {
        id: fields.id,
        picType1: pic_type,
        pic1: pic_data,
      };
      console.log("data", data);
      let result = await rfid_table.update(data, {
        where: { id: data.id },
      });
      res.json({ result, api_result: constance.result_ok });
      console.log(result);
    });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
router.patch("/del_all", async (req, res) => {
  try {
    let result = await rfid_table.destroy({
      where: {},
      truncate: true,
    });
    res.json({ result, api_result: constance.result_ok });
    //console.log(result);
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
    //console.log(error);
  }
});
router.post("/plate", async (req, res) => {
  try {
    const { plate_id } = req.body;
    let dbPassword = await bus_table.findOne({ where: { plate_id } });

    if (dbPassword == null) {
      // if not found
      res.json({
        result: "emp_no_not_found",
        api_result: constance.result_nok,
      });
    } else {
      // if found

      res.json({
        result: dbPassword,
        api_result: constance.result_ok,
      });
    }
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/all_vender", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` where vender = '${req.body.vender}'`;
  }
  try {
    let result = await rfid_table.sequelize.query(
      `
        SELECT plate_id 
      --  FROM driver_attendance.master_rfids
        FROM driver_attendance.master_bus_texts
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
router.put("/update_text", async (req, res) => {
  console.log("/update_text");
  try {
    let result = await rfid_table.update(req.body, {
      where: { id: req.body.id },
    });
    console.log(result);
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
module.exports = router;
