const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const bus_table = require("./../model/master_bus_text");

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
        SELECT master_bus_texts.plate_id,vender,name_bu,name_owner,date_tax,date_inspection,date_insurance 

        ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax)<30,'','none') as display_alert_tax
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection)<30,'','none') as display_alert_inspection
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance)<30,'','none') as display_alert_insurance
,TIMESTAMPDIFF(DAY, CURDATE(), date_tax) as dif_tax
,TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) as dif_inspection
,TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) as dif_insurance

        ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
        ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
        
        ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
        ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
                  
        ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
        ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
        
        ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
        ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
        ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
        
        FROM driver_attendance.master_bus_texts
        left join master_bus_taxes on master_bus_texts.plate_id = master_bus_taxes.plate_id
        left join master_bus_inspections on master_bus_inspections.plate_id = master_bus_taxes.plate_id
        left join master_bus_insurances on master_bus_insurances.plate_id = master_bus_taxes.plate_id
                 
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
      `SELECT master_bus_texts.plate_id,vender,name_bu,name_owner,date_tax,date_inspection,date_insurance 

      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax)<30,'','none') as display_alert_tax
      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection)<30,'','none') as display_alert_inspection
      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance)<30,'','none') as display_alert_insurance
      ,TIMESTAMPDIFF(DAY, CURDATE(), date_tax) as dif_tax
      ,TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) as dif_inspection
      ,TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) as dif_insurance

      ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
      ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
      
      ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
      ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
                
      ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
      ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
      
      ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
      ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
      ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
      
      FROM driver_attendance.master_bus_texts
      left join master_bus_taxes on master_bus_texts.plate_id = master_bus_taxes.plate_id
      left join master_bus_inspections on master_bus_inspections.plate_id = master_bus_taxes.plate_id
      left join master_bus_insurances on master_bus_insurances.plate_id = master_bus_taxes.plate_id
      
      -- /*in complete*/ where ( picType_tax is null or picType_tax = '' or picType_insurance is null or picType_insurance = '' or picType_inspection is null or picType_inspection = '') 
      -- /*tax_expired*/ where (date_tax is null or TIMESTAMPDIFF(DAY, CURDATE(), date_tax)) < 0 
      -- /*insurance_expired*/ where (date_insurance is null or TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0) 
      -- /*inspection_expired*/ where (date_inspection is null or TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0) 
      /*good*/ where picType_tax is not null and picType_tax <> '' and picType_insurance is not null and picType_insurance <> '' and picType_inspection is not null and picType_inspection <> ''
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
      `SELECT master_bus_texts.plate_id,vender,name_bu,name_owner,date_tax,date_inspection,date_insurance 
 
      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax)<30,'','none') as display_alert_tax
      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection)<30,'','none') as display_alert_inspection
      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance)<30,'','none') as display_alert_insurance
      ,TIMESTAMPDIFF(DAY, CURDATE(), date_tax) as dif_tax
      ,TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) as dif_inspection
      ,TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) as dif_insurance

        ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
        ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
        
        ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
        ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
                  
        ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
        ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
        
        ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
        ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
        ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
        
        FROM driver_attendance.master_bus_texts
        left join master_bus_taxes on master_bus_texts.plate_id = master_bus_taxes.plate_id
        left join master_bus_inspections on master_bus_inspections.plate_id = master_bus_taxes.plate_id
        left join master_bus_insurances on master_bus_insurances.plate_id = master_bus_taxes.plate_id
        
    
         /*inspection_expired*/ where (date_inspection is null or TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0) 
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
      `SELECT master_bus_texts.plate_id,vender,name_bu,name_owner,date_tax,date_inspection,date_insurance 

      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax)<30,'','none') as display_alert_tax
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection)<30,'','none') as display_alert_inspection
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance)<30,'','none') as display_alert_insurance
,TIMESTAMPDIFF(DAY, CURDATE(), date_tax) as dif_tax
,TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) as dif_inspection
,TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) as dif_insurance

        ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
        ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
        
        ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
        ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
                  
        ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
        ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
        
        ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
        ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
        ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
        
        FROM driver_attendance.master_bus_texts
        left join master_bus_taxes on master_bus_texts.plate_id = master_bus_taxes.plate_id
        left join master_bus_inspections on master_bus_inspections.plate_id = master_bus_taxes.plate_id
        left join master_bus_insurances on master_bus_insurances.plate_id = master_bus_taxes.plate_id
        
         /*in complete*/ where ( picType_tax is null or picType_tax = '' or picType_insurance is null or picType_insurance = '' or picType_inspection is null or picType_inspection = '') 
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
      `SELECT master_bus_texts.plate_id,vender,name_bu,name_owner,date_tax,date_inspection,date_insurance 

      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax)<30,'','none') as display_alert_tax
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection)<30,'','none') as display_alert_inspection
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance)<30,'','none') as display_alert_insurance
,TIMESTAMPDIFF(DAY, CURDATE(), date_tax) as dif_tax
,TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) as dif_inspection
,TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) as dif_insurance

        ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
        ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
        
        ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
        ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
                  
        ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
        ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
        
        ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
        ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
        ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
        
        FROM driver_attendance.master_bus_texts
        left join master_bus_taxes on master_bus_texts.plate_id = master_bus_taxes.plate_id
        left join master_bus_inspections on master_bus_inspections.plate_id = master_bus_taxes.plate_id
        left join master_bus_insurances on master_bus_insurances.plate_id = master_bus_taxes.plate_id
        
   /*tax_expired*/ where (date_tax is null or TIMESTAMPDIFF(DAY, CURDATE(), date_tax)) < 0  ` +
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
      `SELECT master_bus_texts.plate_id,vender,name_bu,name_owner,date_tax,date_inspection,date_insurance 

      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax)<30,'','none') as display_alert_tax
      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection)<30,'','none') as display_alert_inspection
      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance)<30,'','none') as display_alert_insurance
      ,TIMESTAMPDIFF(DAY, CURDATE(), date_tax) as dif_tax
      ,TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) as dif_inspection
      ,TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) as dif_insurance

        ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
        ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
        
        ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
        ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
                  
        ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
        ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
        
        ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
        ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
        ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
        
        FROM driver_attendance.master_bus_texts
        left join master_bus_taxes on master_bus_texts.plate_id = master_bus_taxes.plate_id
        left join master_bus_inspections on master_bus_inspections.plate_id = master_bus_taxes.plate_id
        left join master_bus_insurances on master_bus_insurances.plate_id = master_bus_taxes.plate_id
        
       
         /*insurance_expired*/ where (date_insurance is null or TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0) 
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
      ` SELECT plate_id FROM driver_attendance.master_bus_texts where plate_id = '${req.body.plate_id}' ` + command_level
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

router.put("/update", async (req, res) => {
  //console.log(req.body.username)
  try {
    let result = await bus_table.update(req.body, {
      where: { plate_id: req.body.plate_id },
    });
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});

router.post("/tax_alert", async (req, res) => {
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
      `SELECT master_bus_texts.plate_id,vender,name_bu,name_owner,date_tax,date_inspection,date_insurance 

      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax)<30,'','none') as display_alert_tax
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection)<30,'','none') as display_alert_inspection
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance)<30,'','none') as display_alert_insurance
,TIMESTAMPDIFF(DAY, CURDATE(), date_tax) as dif_tax
,TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) as dif_inspection
,TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) as dif_insurance

        ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
        ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
        
        ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
        ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
                  
        ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
        ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
        
        ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
        ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
        ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
        
        FROM driver_attendance.master_bus_texts
        left join master_bus_taxes on master_bus_texts.plate_id = master_bus_taxes.plate_id
        left join master_bus_inspections on master_bus_inspections.plate_id = master_bus_taxes.plate_id
        left join master_bus_insurances on master_bus_insurances.plate_id = master_bus_taxes.plate_id

        where TIMESTAMPDIFF(DAY, CURDATE(), date_tax) between 0 and 29
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
router.post("/inspection_alert", async (req, res) => {
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
      `SELECT master_bus_texts.plate_id,vender,name_bu,name_owner,date_tax,date_inspection,date_insurance 

      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax)<30,'','none') as display_alert_tax
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection)<30,'','none') as display_alert_inspection
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance)<30,'','none') as display_alert_insurance
,TIMESTAMPDIFF(DAY, CURDATE(), date_tax) as dif_tax
,TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) as dif_inspection
,TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) as dif_insurance

        ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
        ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
        
        ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
        ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
                  
        ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
        ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
        
        ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
        ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
        ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
        
        FROM driver_attendance.master_bus_texts
        left join master_bus_taxes on master_bus_texts.plate_id = master_bus_taxes.plate_id
        left join master_bus_inspections on master_bus_inspections.plate_id = master_bus_taxes.plate_id
        left join master_bus_insurances on master_bus_insurances.plate_id = master_bus_taxes.plate_id
        
        where TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) between 0 and 29
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
router.post("/insurance_alert", async (req, res) => {
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
      `SELECT master_bus_texts.plate_id,vender,name_bu,name_owner,date_tax,date_inspection,date_insurance 

      ,if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax)<30,'','none') as display_alert_tax
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection)<30,'','none') as display_alert_inspection
,if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance)<30,'','none') as display_alert_insurance
,TIMESTAMPDIFF(DAY, CURDATE(), date_tax) as dif_tax
,TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) as dif_inspection
,TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) as dif_insurance

        ,if(date_tax is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'none','')) as icon_date_tax_ok
        ,if(date_tax is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_tax) < 0,'','none')) as icon_date_tax_ng
        
        ,if(date_inspection is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'none','')) as icon_date_inspection_ok
        ,if(date_inspection is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_inspection) < 0,'','none')) as icon_date_inspection_ng
                  
        ,if(date_insurance is null,'none',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'none','')) as icon_date_insurance_ok
        ,if(date_insurance is null,'',if(TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) < 0,'','none')) as icon_date_insurance_ng
        
        ,if(picType_tax is null,'none',if(picType_tax = '','none','') ) as icon_pic_tax
        ,if(picType_inspection is null,'none',if(picType_inspection = '','none','') ) as icon_pic_inspection
        ,if(picType_insurance is null,'none',if(picType_insurance = '','none','') ) as icon_pic_insurance
        
        FROM driver_attendance.master_bus_texts
        left join master_bus_taxes on master_bus_texts.plate_id = master_bus_taxes.plate_id
        left join master_bus_inspections on master_bus_inspections.plate_id = master_bus_taxes.plate_id
        left join master_bus_insurances on master_bus_insurances.plate_id = master_bus_taxes.plate_id
        
        where TIMESTAMPDIFF(DAY, CURDATE(), date_insurance) between 0 and 29
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
