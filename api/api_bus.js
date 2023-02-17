const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const bus_table = require("./../model/master_bus");

const constance = require("./../constance/constance");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const fs = require("fs-extra");

router.post("/all", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` where vender = '${req.body.vender}'`;
  }
  try {
    let result = await bus_table.sequelize.query(
      `
        SELECT vender,plate_id,name_bu,name_owner
        ,date_tax,date_inspection,date_insurance
        
        ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
        ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
        
        ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
        ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
        
        ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
        ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
        
        ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
        ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
        ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
         FROM driver_attendance.master_buses
               
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
    let result = await bus_table.sequelize.query(
      `
        SELECT vender,plate_id,name_bu,name_owner
        ,date_tax,date_inspection,date_insurance
        
        ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
        ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
        
        ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
        ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
        
        ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
        ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
        
        ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
        ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
        ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
         FROM driver_attendance.master_buses
         /*in complete*/
        where ( picType_tax is null or picType_tax = ''
          or picType_insurance is null or picType_insurance = ''
         or picType_inspection is null or picType_inspection = ''     ) 
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
router.post("/tax", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {
    let result = await bus_table.sequelize.query(
      `
        SELECT vender,plate_id,name_bu,name_owner
        ,date_tax,date_inspection,date_insurance
        
        ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
        ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
        
        ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
        ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
        
        ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
        ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
        
        ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
        ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
        ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
         FROM driver_attendance.master_buses
         where (date_tax is null or TIMESTAMPDIFF(DAY, CURDATE(), date_tax)) < 0 /*tax_expired*/     
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
router.post("/insurance", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {
    let result = await bus_table.sequelize.query(
      `
          SELECT vender,plate_id,name_bu,name_owner
          ,date_tax,date_inspection,date_insurance
          
          ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
          ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
          
          ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
          ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
          
          ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
          ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
          
          ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
          ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
          ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
           FROM driver_attendance.master_buses
           where (date_insurance is null or TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0) /*insurance_expired*/   
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
router.post("/inspection", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {
    let result = await bus_table.sequelize.query(
      `
          SELECT vender,plate_id,name_bu,name_owner
          ,date_tax,date_inspection,date_insurance
          
          ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
          ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
          
          ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
          ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
          
          ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
          ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
          
          ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
          ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
          ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
           FROM driver_attendance.master_buses
           where (date_inspection is null or TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0) /*inspection_expired*/
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
    let result = await bus_table.sequelize.query(
      `
          SELECT vender,plate_id,name_bu,name_owner
          ,date_tax,date_inspection,date_insurance
          
          ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
          ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
          
          ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
          ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
          
          ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
          ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
          
          ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
          ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
          ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
           FROM driver_attendance.master_buses
           /*good*/
           where picType_tax is not null and picType_tax <> '' and picType_insurance is not null and picType_insurance <> '' and picType_inspection is not null and picType_inspection <> ''
           and date_tax is not null AND TIMESTAMPDIFF(DAY, CURDATE(), date_tax) >= 0
           and date_inspection is not null and TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) >= 0
           and date_insurance is not null and TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) >= 0
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
router.get("/pic_tax/:plate_id", async (req, res) => {
  try {
    const { plate_id } = req.params;
    let result = await bus_table.findOne({
      where: { plate_id: plate_id },
    });
    res.type(result.picType_tax);
    res.end(result.pic_tax);
  } catch (error) {
    res.json({
      error,
    });
  }
});
router.get("/pic_inspection/:plate_id", async (req, res) => {
  try {
    const { plate_id } = req.params;
    let result = await bus_table.findOne({
      where: { plate_id: plate_id },
    });
    res.type(result.picType_inspection);
    res.end(result.pic_inspection);
  } catch (error) {
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
router.post("/all_plate", async (req, res) => {
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` where vender = '${req.body.vender}'`;
  }
  try {
    let result = await bus_table.sequelize.query(
      `
      SELECT distinct plate_id
       FROM driver_attendance.master_buses
             
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
router.post("/find_plate_checkdup", async (req, res) => {
  console.log("find_plate_checkdup");
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {
    let result = await bus_table.sequelize.query(
      `
        SELECT vender,plate_id,name_bu,name_owner
        ,date_tax,date_inspection,date_insurance
    
         FROM driver_attendance.master_buses
         where plate_id = '${req.body.plate_id}' ` + command_level
    );
    res.json({ result: result[0], api_result: constance.result_ok });

   
  } catch (error) {
    res.json({
      error,
      message: constance.OK,
    });
  }
});
router.post("/in", async (req, res) => {
  try {
    let insert_result = await bus_table.create(req.body); //await คือรอให้ส่ง ข้อมูลก่อนจึงตอบ
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});





router.post("/find_plate", async (req, res) => {
  console.log("find_plate");
  console.log(req.body);
  var command_level = "";
  // if (req.body.lv == "Admin" || req.body.lv == "Super") {
  if (req.body.lv == "Admin") {
    command_level = ``;
  } else {
    command_level = ` and vender = '${req.body.vender}'`;
  }
  try {
    let result = await bus_table.sequelize.query(
      `
        SELECT vender,plate_id,name_bu,name_owner
        ,date_tax,date_inspection,date_insurance
        ,pic_tax,picType_tax
        ,pic_inspection,picType_inspection
        ,pic_insurance,picType_insurance
        ,if(date_tax is null,'lightcoral',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'lightcoral','lightgreen')) as color_tax
        ,if(date_inspection is null,'lightcoral',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'lightcoral','lightgreen')) as color_inspection
        ,if(date_insurance is null,'lightcoral',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'lightcoral','lightgreen')) as color_insurance
         FROM driver_attendance.master_buses
         where plate_id = '${req.body.plate_id}' ` + command_level
    );
    res.json({ result: result[0], api_result: constance.result_ok });

   
  } catch (error) {
    res.json({
      error,
      message: constance.OK,
    });
  }
});

router.post("/find_plate2", async (req, res) => {
  console.log("find_plate2");
  // const { plate_id } = req.body;
  console.log(req.body.plate_id);
  try {
    let result = await bus_table.findOne(
      {
        attributes: ["vender","plate_id","name_bu","name_owner","date_tax","date_inspection","date_insurance",
        "pic_tax","picType_tax","pic_inspection","picType_inspection"
        ,"pic_insurance","picType_insurance"],
      },
      { where: { plate_id :req.body.plate_id} }
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
router.post("/find_vender_plate", async (req, res) => {
  // const { plate_id } = req.body;
  // console.log(plate_id);
  try {
    let result = await bus_table.sequelize.query(
      `SELECT vender FROM driver_attendance.master_buses
         where plate_id = '${req.body.plate_id}' `
    );
   console.log(result[0]);
    res.json({ result :result[0], api_result: constance.result_ok });
  } catch (error) {
    // console.log(error);
    res.json({
      error,
    });
  }
});
router.post("/in_new", async (req, res) => {
  console.log("/bus_in_new");

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
      if (files.pic_tax == undefined) {
        picType_tax = "";
        pic_tax = "";
      } else {
        picType_tax = files.pic_tax.type;
        pic_tax = fs.readFileSync(files.pic_tax.path);
      }
      if (files.pic_inspection == undefined) {
        picType_inspection = "";
        pic_inspection = "";
      } else {
        picType_inspection = files.pic_inspection.type;
        pic_inspection = fs.readFileSync(files.pic_inspection.path);
      }
      if (files.pic_insurance == undefined) {
        picType_insurance = "";
        pic_insurance = "";
        // check_pic = "no";
      } else {
        picType_insurance = files.pic_insurance.type;
        pic_insurance = fs.readFileSync(files.pic_insurance.path);
      }

      var data = {
        vender: fields.vender,
        plate_id: fields.plate_id,
        name_bu: fields.name_bu,
        name_owner: fields.name_owner,
        date_tax: fields.date_tax,
        date_inspection: fields.date_inspection,
        date_insurance: fields.date_insurance,

        pic_tax: pic_tax,
        picType_tax: picType_tax,
        pic_inspection: pic_inspection,
        picType_inspection: picType_inspection,
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

router.patch("/del_bus", async (req, res) => {
  console.log("/del_bus");
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

router.post("/update_text", async (req, res) => {
  try {
    let result = await bus_table.sequelize.query(
      `
      UPDATE driver_attendance.master_buses
      SET
      vender = '${req.body.vender}',
      name_bu = '${req.body.name_bu}',
      name_owner = '${req.body.name_owner}',
      date_tax ='${req.body.date_tax}' ,
      date_inspection = '${req.body.date_inspection}',
      date_insurance = '${req.body.date_insurance}'
         where plate_id = '${req.body.plate_id}' ` 
    );
    

    res.json({  api_result: constance.result_ok });

   
  } catch (error) {
    res.json({
      error,
      api_result: constance.result_nok,
    });
  }
});
router.post("/update_pic_tax", async (req, res) => {
  //   console.log("/bus_in_new");

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

      if (files.pic_tax == undefined) {
        picType_tax = "";
        pic_tax = "";
      } else {
        picType_tax = files.pic_tax.type;
        pic_tax = fs.readFileSync(files.pic_tax.path);
      }
      // if (files.pic_inspection == undefined) {
      //   picType_inspection = "";
      //   pic_inspection = "";
      // } else {
      //   picType_inspection = files.pic_inspection.type;
      //   pic_inspection = fs.readFileSync(files.pic_inspection.path);
      // }
      // if (files.pic_insurance == undefined) {
      //   picType_insurance = "";
      //   pic_insurance = "";
      // } else {
      //   picType_insurance = files.pic_insurance.type;
      //   pic_insurance = fs.readFileSync(files.pic_insurance.path);
      // }
      var data = {
        plate_id: fields.plate_id,
        pic_tax: pic_tax,
        picType_tax: picType_tax,
        //   pic_inspection: pic_inspection,
        //   picType_inspection: picType_inspection,
        //   pic_insurance: pic_insurance,
        //   picType_insurance: picType_insurance,
      };

      console.log("data", data);
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
router.post("/update_pic_inspection", async (req, res) => {
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
      if (files.pic_inspection == undefined) {
        picType_inspection = "";
        pic_inspection = "";
      } else {
        picType_inspection = files.pic_inspection.type;
        pic_inspection = fs.readFileSync(files.pic_inspection.path);
      }
      // if (files.pic_insurance == undefined) {
      //   picType_insurance = "";
      //   pic_insurance = "";
      // } else {
      //   picType_insurance = files.pic_insurance.type;
      //   pic_insurance = fs.readFileSync(files.pic_insurance.path);
      // }
      var data = {
        plate_id: fields.plate_id,
        //   pic_tax: pic_tax,
        //   picType_tax: picType_tax,
        pic_inspection: pic_inspection,
        picType_inspection: picType_inspection,
        //   pic_insurance: pic_insurance,
        //   picType_insurance: picType_insurance,
      };

      console.log("data", data);
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
