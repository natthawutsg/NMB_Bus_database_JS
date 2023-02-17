const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const bus_table = require("../model/master_bus_insurance");

const constance = require("../constance/constance");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const fs = require("fs-extra");

router.post("/find_plate2", async (req, res) => {
  console.log("find_plate2");
  // const { plate_id } = req.body;
  console.log(req.body.plate_id);
  try {
    let result = await bus_table.findOne(
      {
        attributes: ["plate_id", "pic_insurance", "picType_insurance"],
      },
      { where: { plate_id: req.body.plate_id } }
    );
    console.log(result);
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({
      error,
    });
  }
});
router.get("/pic_insurance/:plate_id", async (req, res) => {
  try {
    const { plate_id } = req.params;
    let result = await bus_table.findOne({
      where: { plate_id: plate_id },
    });
    res.type(result.picType_insurance);
    res.end(result.pic_insurance);
  } catch (error) {
    res.json({
      error,
    });
  }
});
router.post("/in", async (req, res) => {
    console.log("/bus_in_new");
  
    try {
      const form = new formidable.IncomingForm();
    //   var pic_tax;
    //   var picType_tax;
      //   var pic_inspection;
      //   var picType_inspection;
        var pic_insurance;
        var picType_insurance;
  
      form.parse(req, async (error, fields, files) => {
        // if (files.pic_tax == undefined) {
        //   picType_tax = "";
        //   pic_tax = "";
        // } else {
        //   picType_tax = files.pic_tax.type;
        //   pic_tax = fs.readFileSync(files.pic_tax.path);
        // }
        // if (files.pic_inspection == undefined) {
        //   picType_inspection = "";
        //   pic_inspection = "";
        // } else {
        //   picType_inspection = files.pic_inspection.type;
        //   pic_inspection = fs.readFileSync(files.pic_inspection.path);
        // }
        if (files.pic_insurance == undefined) {
          picType_insurance = "";
          pic_insurance = "";
          // check_pic = "no";
        } else {
          picType_insurance = files.pic_insurance.type;
          pic_insurance = fs.readFileSync(files.pic_insurance.path);
        }
  
        var data = {
          plate_id: fields.plate_id,
        //   pic_tax: pic_tax,
        //   picType_tax: picType_tax,
          //   pic_inspection: pic_inspection,
          //   picType_inspection: picType_inspection,
            pic_insurance: pic_insurance,
            picType_insurance: picType_insurance,
        };
        console.log("data", data);
        let result = await bus_table.create(data);
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
  router.patch("/del", async (req, res) => {
    console.log("/del");
    try {
      let result = await bus_table.destroy({
        where: { plate_id: req.body.plate_id },
      });
      res.json({ result, api_result: constance.result_ok });
      console.log(result);
    } catch (error) {
      res.json({ error, api_result: constance.result_nok });
      console.log(error);
    }
  });

  router.post("/update_pic_insurance", async (req, res) => {
    // console.log("/bus_in_new");
  
    try {
      const form = new formidable.IncomingForm();
  
      //   var pic_type;
      //   var pic_data;
  
      var pic_tax;
      var picType_tax;
      var pic_inspection;
      var picType_inspection;
      var pic_insurance;
      var picType_insurance;
  
      form.parse(req, async (error, fields, files) => {
        //   console.log("files.pic_tax",files.pic_tax);
        //   console.log("files.pic_inspection",files.pic_inspection);
        //   console.log("files.pic_insurance",files.pic_insurance);
  
        // if (files.pic_tax == undefined) {
        //   picType_tax = "";
        //   pic_tax = "";
        // } else {
        //   picType_tax = files.pic_tax.type;
        //   pic_tax = fs.readFileSync(files.pic_tax.path);
        // }
        // if (files.pic_inspection == undefined) {
        //   picType_inspection = "";
        //   pic_inspection = "";
        // } else {
        //   picType_inspection = files.pic_inspection.type;
        //   pic_inspection = fs.readFileSync(files.pic_inspection.path);
        // }
        if (files.pic_insurance == undefined) {
          picType_insurance = "";
          pic_insurance = "";
        } else {
          picType_insurance = files.pic_insurance.type;
          pic_insurance = fs.readFileSync(files.pic_insurance.path);
        }
        var data = {
          plate_id: fields.plate_id,
          //   pic_tax: pic_tax,
          //   picType_tax: picType_tax,
          //   pic_inspection: pic_inspection,
          //   picType_inspection: picType_inspection,
          pic_insurance: pic_insurance,
          picType_insurance: picType_insurance,
        };
  
        // console.log("data", data);
        let result = await bus_table.update(data, {
          where: { plate_id: data.plate_id },
        });
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
module.exports = router;
