const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const route_table = require("../model/master_route");

const constance = require("../constance/constance");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
//select
router.get("/all", async (req, res) => {
  try {
    let result = await route_table.findAll();
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
router.post("/in", async (req, res) => {
  try {
    let insert_result = await route_table.create(req.body); //await คือรอให้ส่ง ข้อมูลก่อนจึงตอบ
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});
router.patch("/del", async (req, res) => {
  try {
    let result = await route_table.destroy({
      where: { id: req.body.id },
    });
    res.json({ result, api_result: constance.result_ok });
    //console.log(result);
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
    //console.log(error);
  }
});
router.post("/dup", async (req, res) => {
  try {
    let insert_result = await route_table.findAll({
      where:
       {route: req.body.route }
    
    }); //await คือรอให้ส่ง ข้อมูลก่อนจึงตอบ
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});
module.exports = router;
