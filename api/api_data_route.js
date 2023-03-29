const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const data_route_table = require("../model/data_route");
const constance = require("../constance/constance");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
//select
router.get("/all", async (req, res) => {
  try {
    let result = await data_route_table.findAll();
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/in", async (req, res) => {
  try {
    let insert_result = await data_route_table.create(req.body); //await คือรอให้ส่ง ข้อมูลก่อนจึงตอบ
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});
router.patch("/del", async (req, res) => {
  try {
    let result = await data_route_table.destroy({
      where: { mfgdate: req.body.date },
    });
    res.json({ result, api_result: constance.result_ok });
    //console.log(result);
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
    //console.log(error);
  }
});
router.post("/all_qry", async (req, res) => {
  console.log(req.body);

  var command_level = "";
    if (req.body.vender == "All" ) {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {

    let result = await data_route_table.sequelize.query(
      `

        with tb1 as(
          SELECT route,shift,data_routes.plate_id,data_routes.petrol,data_routes.mfgdate
          FROM driver_attendance.data_routes
          where mfgdate = '${req.body.date}' 
          )


        select route,petrol
        ,max(CASE WHEN shift = 'AM_in' THEN plate_id ELSE '' END) AS 'AM_in'
        ,max(CASE WHEN shift = 'CN_out' THEN plate_id ELSE '' END) AS 'CN_out'
        ,max(CASE WHEN shift = 'B_in' THEN plate_id ELSE '' END) AS 'B_in'
        ,max(CASE WHEN shift = 'A_out' THEN plate_id ELSE '' END) AS 'A_out'
        ,max(CASE WHEN shift = 'N_in' THEN plate_id ELSE '' END) AS 'N_in'
        ,max(CASE WHEN shift = 'M_out' THEN plate_id ELSE '' END) AS 'M_out'
        ,max(CASE WHEN shift = 'C_in' THEN plate_id ELSE '' END) AS 'C_in'
        ,max(CASE WHEN shift = 'B_out' THEN plate_id ELSE '' END) AS 'B_out'
        ,max(CASE WHEN shift = 'D_in' THEN plate_id ELSE '' END) AS 'D_in'
        ,max(CASE WHEN shift = 'D_out' THEN plate_id ELSE '' END) AS 'D_out'
        from tb1
        group by route,petrol
        order by route
              ` 
               
    );

    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/copy", async (req, res) => {
  // console.log(req.body);

  try {

    let result = await data_route_table.sequelize.query(
      `INSERT INTO driver_attendance.data_routes
      (mfgdate,shift,route,plate_id,petrol)
      SELECT '${req.body.date_to}', shift,route,plate_id,petrol 
      FROM data_routes
      where mfgdate = '${req.body.date_from}'
      ` 
               
    );

    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/chk_dup", async (req, res) => {
  try {
    let result = await data_route_table.findAll({
      where: {
        [Op.and]: [{mfgdate: req.body.mfgdate}, {shift: req.body.shift}, {route: req.body.route}]
      }
    });
    res.json({ result, api_result: constance.result_ok });
    //console.log(result);
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
    //console.log(error);
  }
});
router.put("/change_petrol", async (req, res) => {

  try {
    let result = await data_route_table.update(req.body, {
      where: { mfgdate: req.body.date },
    });
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});
router.put("/change_plate", async (req, res) => {

  try {
    let result = await data_route_table.update(req.body, {
      where: {
        [Op.and]: [{mfgdate: req.body.mfgdate}, {shift: req.body.shift}, {route: req.body.route}]
      }
    });
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/report_plate", async (req, res) => {
  console.log(req.body);

  var command_level = "";
    if (req.body.vender == "All" ) {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {

    let result = await data_route_table.sequelize.query(
      `
          with tb1 as(
            SELECT route,shift,plate_id,petrol,mfgdate
            FROM driver_attendance.data_routes
            where mfgdate between '${req.body.date_from}'  and '${req.body.date_to}' 
     and plate_id = '${req.body.plate}' 
            )
  
          select mfgdate,petrol
          ,max(CASE WHEN shift = 'AM_in' THEN route ELSE '' END) AS 'AM_in'
          ,max(CASE WHEN shift = 'CN_out' THEN route ELSE '' END) AS 'CN_out'
          ,max(CASE WHEN shift = 'B_in' THEN route ELSE '' END) AS 'B_in'
          ,max(CASE WHEN shift = 'A_out' THEN route ELSE '' END) AS 'A_out'
          ,max(CASE WHEN shift = 'N_in' THEN route ELSE '' END) AS 'N_in'
          ,max(CASE WHEN shift = 'M_out' THEN route ELSE '' END) AS 'M_out'
          ,max(CASE WHEN shift = 'C_in' THEN route ELSE '' END) AS 'C_in'
          ,max(CASE WHEN shift = 'B_out' THEN route ELSE '' END) AS 'B_out'
          ,max(CASE WHEN shift = 'D_in' THEN route ELSE '' END) AS 'D_in'
          ,max(CASE WHEN shift = 'D_out' THEN route ELSE '' END) AS 'D_out'
          from tb1
          group by mfgdate,petrol
          order by route
              ` 
               
    );

    res.json({ result: result[0], api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
module.exports = router;
