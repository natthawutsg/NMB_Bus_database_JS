//Reference
const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const camera_table = require("./../model/data_camera");

const constance = require("./../constance/constance");
const bcrypt = require("bcryptjs");
const { attributes } = require("sequelize");

function getDatesInRange(startDate, endDate) {
  const date = new Date(startDate.getTime());
  const dates = [];
  while (date <= endDate) {
    dates.push(formatDate(new Date(date)));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}
router.post("/find_last", async (req, res) => {
   
  try {
    // const { emp_no } = req.body;
    let dbPassword = await camera_table.sequelize.query(
      `
        SELECT max(timestamp) as timestamp 
        FROM driver_attendance.data_cameras
        where emp_no = '${req.body.emp_no}';     
        `
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
router.post("/in", async (req, res) => {
  try {
    let insert_result = await camera_table.create(req.body); //await คือรอให้ส่ง ข้อมูลก่อนจึงตอบ
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});
router.post("/report_raw", async (req, res) => {
  console.log(req.body);
  var command_level = "";
   // if (req.body.lv == "Admin" || req.body.lv == "Super") {
    if (req.body.lv == "Admin" ) {
    command_level = ``
  } else {
    command_level = ` and vender = '${req.body.vender}'`
  }
  try {
    // const { emp_no } = req.body;
    let dbPassword = await camera_table.sequelize.query(
      `
          SELECT id,mfgdate,time,rfid,emp_no,driver_name,plate_id,vender ,remark,camera_condition 
          FROM driver_attendance.data_cameras
          where mfgdate between '${req.body.date_start}' and '${req.body.date_end}'
          `+command_level+`
          ;
            `
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
router.post("/report_pivot", async (req, res) => {
  console.log(req.body);
  var command_level = "";
   // if (req.body.lv == "Admin" || req.body.lv == "Super") {
    if (req.body.lv == "Admin" ) {
    command_level = ``
  } else {
    command_level = ` and vender = '${req.body.vender}'`
  }
  try {

    let dbPassword = await camera_table.sequelize.query(
      `
      SELECT
      mfgdate
      ,SUM(camera_condition = 'OK') AS 'OK'
      ,SUM(camera_condition = 'NG') AS'NG'
     
 FROM driver_attendance.data_cameras
 where mfgdate between '${req.body.date_start}' and '${req.body.date_end}'
 `+command_level+`
  GROUP BY mfgdate;
            `
    );
    res.json({
      result: dbPassword[0],
      api_result: constance.result_ok,
    //   list_date,
    });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }


});
router.post("/report_excel", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
    if (req.body.lv == "Admin" ) {
    command_level = ``
  } else {
    command_level = ` where vender = '${req.body.vender}'`
  }


  var list_date = [];
  list_date = getDatesInRange(new Date(req.body.date_start), new Date(req.body.date_end));
  console.log("list_date", list_date);
  var sql_command = "";
  
  for (let index = 0; index < list_date.length; index++) {
    sql_command = sql_command + `,max(case when mfgdate = '` + list_date[index] + `' then camera_condition end) '` + list_date[index] + `'`;
  }


  try {

    let dbPassword = await camera_table.sequelize.query(

      `
      WITH tb1 AS (SELECT  master_rfids.emp_no,master_rfids.driver_name,master_rfids.plate_id,master_rfids.vender,mfgdate ,camera_condition
        FROM driver_attendance.master_rfids
        left join  driver_attendance.data_cameras on master_rfids.emp_no = data_cameras.emp_no
      
          )   
      
      select 
      emp_no,plate_id
      ` +
      sql_command +
      `
  
  from (
    select emp_no,driver_name,plate_id,vender,mfgdate,camera_condition, row_number() over (partition by emp_no,plate_id order by emp_no) rn
   from tb1
    `+command_level+`
  ) t
  group by emp_no,plate_id
            `
    );
    res.json({
      result: dbPassword[0],
      api_result: constance.result_ok,
    //   list_date,
    });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }


});
router.patch("/delete", async (req, res) => {
  try {
    let result = await camera_table.destroy({
      where: { id: req.body.id },
    });
    res.json({ result, api_result: constance.result_ok });
    //console.log(result);
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
    //console.log(error);
  }
});
router.post("/top_5", async (req, res) => {
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
   if (req.body.lv == "Admin" ) {
   command_level = ``
 } else {
   command_level = ` where vender = '${req.body.vender}'`
 }
  try {
    // const { emp_no } = req.body;
    let dbPassword = await camera_table.sequelize.query(
      `SELECT mfgdate,time,emp_no,driver_name,plate_id,vender,camera_condition 
      ,if(camera_condition = 'NG','red','green') as color
       FROM driver_attendance.data_cameras
       `+command_level+`
      order by timestamp desc limit 5;     
        `
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
module.exports = router;
