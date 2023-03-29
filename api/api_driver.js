//Reference
const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const driver_table = require("./../model/master_driver");

const constance = require("./../constance/constance");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const fs = require("fs-extra");
router.post("/all", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {
    let result = await driver_table.sequelize.query(
      `SELECT master_rfids.emp_no
      ,rfid
      -- ,master_drivers.emp_no 
      ,license_date,driver_name
      ,if(master_drivers.picType1 is null or master_drivers.picType1 ='','none','') as icon_pic  
            ,TIMESTAMPDIFF(DAY, CURDATE(), license_date) as license_remain,vender
            ,case  when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  ''
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  ''	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else ''
                          end as case_color
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  ''
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  'none'
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  'none'	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else 'none'
                          end as display_green
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  'none'
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  ''	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else 'none'
                          end as display_yellow
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  ''
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  'none'	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  ''
                          else ''
                          end as display_red
      
      
      FROM driver_attendance.master_rfids
      left join master_drivers
      on  master_rfids.emp_no = master_drivers.emp_no
       where master_rfids.emp_no <> ''
              ` +
        command_level +
        ``
    );
    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/incomplete", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {
    let result = await driver_table.sequelize.query(
      `SELECT master_rfids.emp_no
      ,rfid
      -- ,master_drivers.emp_no 
      ,license_date,driver_name
      ,if(master_drivers.picType1 is null or master_drivers.picType1 ='','none','') as icon_pic  
            ,TIMESTAMPDIFF(DAY, CURDATE(), license_date) as license_remain,vender
            ,case  when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  ''
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  ''	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else ''
                          end as case_color
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  ''
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  'none'
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  'none'	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else 'none'
                          end as display_green
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  'none'
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  ''	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else 'none'
                          end as display_yellow
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  ''
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  'none'	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  ''
                          else ''
                          end as display_red
      
      
      FROM driver_attendance.master_rfids
      left join master_drivers
      on  master_rfids.emp_no = master_drivers.emp_no
       where master_rfids.emp_no <> ''
              ` +
        command_level +
        `and (master_drivers.picType1 is null or master_drivers.picType1 ='')`
    );
    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/expire", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {
    let result = await driver_table.sequelize.query(
      `SELECT master_rfids.emp_no
      ,rfid
      -- ,master_drivers.emp_no 
      ,license_date,driver_name
      ,if(master_drivers.picType1 is null or master_drivers.picType1 ='','none','') as icon_pic  
            ,TIMESTAMPDIFF(DAY, CURDATE(), license_date) as license_remain,vender
            ,case  when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  ''
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  ''	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else ''
                          end as case_color
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  ''
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  'none'
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  'none'	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else 'none'
                          end as display_green
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  'none'
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  ''	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else 'none'
                          end as display_yellow
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  ''
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  'none'	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  ''
                          else ''
                          end as display_red
      
      
      FROM driver_attendance.master_rfids
      left join master_drivers
      on  master_rfids.emp_no = master_drivers.emp_no
       where master_rfids.emp_no <> ''
              ` +
        command_level +
        `and TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 `
    );
    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/alert", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {
    let result = await driver_table.sequelize.query(
      `SELECT master_rfids.emp_no
      ,rfid
      -- ,master_drivers.emp_no 
      ,license_date,driver_name
      ,if(master_drivers.picType1 is null or master_drivers.picType1 ='','none','') as icon_pic  
            ,TIMESTAMPDIFF(DAY, CURDATE(), license_date) as license_remain,vender
            ,case  when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  ''
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  ''	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else ''
                          end as case_color
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  ''
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  'none'
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  'none'	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else 'none'
                          end as display_green
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  'none'
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  ''	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else 'none'
                          end as display_yellow
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  ''
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  'none'	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  ''
                          else ''
                          end as display_red
      
      
      FROM driver_attendance.master_rfids
      left join master_drivers
      on  master_rfids.emp_no = master_drivers.emp_no
       where master_rfids.emp_no <> ''
              ` +
        command_level +
        `and TIMESTAMPDIFF(DAY, CURDATE(), license_date) between 0  and 44 `
    );
    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/good", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {
    let result = await driver_table.sequelize.query(
      `SELECT master_rfids.emp_no
      ,rfid
      -- ,master_drivers.emp_no 
      ,license_date,driver_name
      ,if(master_drivers.picType1 is null or master_drivers.picType1 ='','none','') as icon_pic  
            ,TIMESTAMPDIFF(DAY, CURDATE(), license_date) as license_remain,vender
            ,case  when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  ''
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  ''	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else ''
                          end as case_color
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  ''
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  'none'
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  'none'	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else 'none'
                          end as display_green
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  'none'
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  ''	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  'none'
                          else 'none'
                          end as display_yellow
                    ,case 
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) >= 45 then  'none'
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 0 then  ''
                        when TIMESTAMPDIFF(DAY, CURDATE(), license_date) < 45 then  'none'	
                          when TIMESTAMPDIFF(DAY, CURDATE(), license_date) is null then  ''
                          else ''
                          end as display_red
      
      
      FROM driver_attendance.master_rfids
      left join master_drivers
      on  master_rfids.emp_no = master_drivers.emp_no
       where master_rfids.emp_no <> ''
              ` +
        command_level +
        `and TIMESTAMPDIFF(DAY, CURDATE(), license_date)  > 44 `
    );
    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
router.patch("/del", async (req, res) => {
  try {
    let result = await driver_table.destroy({
      where: { emp_no: req.body.emp_no },
    });
    res.json({ result, api_result: constance.result_ok });
    //console.log(result);
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
    //console.log(error);
  }
});
router.post("/in_new", async (req, res) => {
  console.log("/driver_table_in_new");

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
        emp_no: fields.emp_no,
        license_date: fields.license_date,
        birth_date: fields.birth_date,

        picType1: pic_type,
        pic1: pic_data,
      };
      console.log("data", data);
      let result = await driver_table.create(data);
      res.json({ result, api_result: constance.result_ok });
      console.log(result);
    });
  } catch (error) {
    console.log("error", error);
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
router.get("/picture/:emp_no", async (req, res) => {
  try {
    const { emp_no } = req.params;
    let result = await driver_table.findOne({
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
router.post("/find_emp_no", async (req, res) => {
  try {
    let result = await driver_table.findOne({
      where: { emp_no: req.body.emp_no },
    });
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    res.json({
      error,
      message: constants.OK,
    });
  }
});
router.post("/update", async (req, res) => {
  console.log("/update");

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
        emp_no: fields.emp_no,
        license_date: fields.license_date,
        birth_date: fields.birth_date,

        picType1: pic_type,
        pic1: pic_data,
      };

      let result = await driver_table.update(
        {
          license_date: data.license_date,
          birth_date: data.birth_date,

          picType1: data.picType1,
          pic1: data.pic1,
        },
        {
          where: { emp_no: data.emp_no },
        }
      );
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
router.put("/update_birthdate", async (req, res) => {
  try {
    let result = await driver_table.update(
      { birth_date: req.body.birth_date },
      {
        where: { emp_no: req.body.emp_no },
      }
    );
    console.log(result);
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
module.exports = router;
