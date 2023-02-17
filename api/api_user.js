//Reference
const express = require("express");
const router = express.Router();
const Sequelize = require("Sequelize");
//Create constance and link to model
// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
const user_table = require("./../model/user");

const constance = require("./../constance/constance");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // select [password] from user_table where [username] = username(req.body)
    let dbPassword = await user_table.findOne({ where: { username } });

    if (dbPassword == null) {
      // if not found
      res.json({
        error: "username_not_found",
        api_result: constance.result_nok,
      });
    } else {
      // if found
      if (bcrypt.compareSync(password, dbPassword.password)) {
        // if input (password > hash) = [password] from user_table then

        res.json({
          result:dbPassword,
          api_result: constance.result_ok });
      } else {
        res.json({ error: "wrong password", api_result: constance.result_nok });
      }
    }
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});



//insert
router.post("/regist", async (req, res) => {
  // ส่งเข้าตรงๆ no message alarm
  //user_table.create(req.body)
  //console.log(req.body);
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 8); //convert to hash password before send
    let insert_result = await user_table.create(req.body); //await คือรอให้ส่ง ข้อมูลก่อนจึงตอบ
    res.json({ result: insert_result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ result: error, api_result: constance.result_nok });
  }
});

//update
router.put("/password", async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 8); //convert to hash password before send
    let result = await user_table.update(req.body, {
      where: { username: req.body.username },
    });
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});

//select
router.get("/all", async (req, res) => {
  try {
    let result = await user_table.findAll();
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    console.log(error);
    res.json({ error, api_result: constance.result_nok });
  }
});
//update
router.put("/level", async (req, res) => {
  //console.log(req.body.username)
  try {
    let result = await user_table.update(req.body, {
      where: { username: req.body.username },
    });
    res.json({ result, api_result: constance.result_ok });
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
  }
});

//delete
router.patch("/delete", async (req, res) => {
  try {
    let result = await user_table.destroy({
      where: { username: req.body.username },
    });
    res.json({ result, api_result: constance.result_ok });
    //console.log(result);
  } catch (error) {
    res.json({ error, api_result: constance.result_nok });
    //console.log(error);
  }
});


//query
router.get("/level_query", async (req, res) => {
  let result = await user_table.sequelize.query(
    `SELECT [levelUser],count([levelUser]) as[Qty]
    FROM [LPB_PM].[dbo].[users] group by [levelUser]
    ORDER BY
    CASE
      WHEN levelUser = 'Admin' THEN 1
     WHEN levelUser = 'User' THEN 2
      WHEN levelUser = 'Guest' THEN 3
    END;
    
    `
  );
  //console.log({ result });
  res.json({ result: result[0] });
});

router.get("/test", async (req, res) => {

  //console.log({ result });
  res.json({ result: 'online' });
});
module.exports = router;
