//Reference
const express = require("express");
const app = express();
//==========================================================================
//-npm i cors
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./api/api_user");

app.use(bodyParser.json()); //ทำให้ API เห็น body ได้
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use("/", router);
app.use(express.static(path.join(__dirname, "./files")));
app.use(cors());
//==========================================================================

// จะทำงาน แม้ว่ายังไม่มีการกด link ก็ตาม
//use : address ที่ใช้เรียก
//require : path ที่เก็บใน Folder

app.use("/user", require("./api/api_user"));
app.use("/vender", require("./api/api_vender"));
app.use("/rfid", require("./api/api_rfid"));
app.use("/record", require("./api/api_record"));
app.use("/camera", require("./api/api_camera"));
app.use("/driver", require("./api/api_driver"));
app.use("/black", require("./api/api_black"));
app.use("/opd", require("./api/api_opd"));
app.use("/opd_record", require("./api/api_record_opd"));
app.use("/bus", require("./api/api_bus"));
app.use("/achive_bus", require("./api/aip_achive_bus"));
app.use("/achive_driver", require("./api/api_achive_driver"));
app.use("/notice", require("./api/api_notify"));

app.use("/bus_text", require("./api/api_bus_text"));
app.use("/bus_tax", require("./api/api_bus_tax"));
app.use("/bus_insurance", require("./api/api_bus_insurance"));
app.use("/bus_inspection", require("./api/api_bus_inspection"));

app.use("/shift", require("./api/api_shift"));
app.use("/route", require("./api/api_route"));
app.use("/data_route", require("./api/api_data_route"));
//Port ที่เชือมมาที่ BackEnd
app.listen(1800, () => {
  console.log(".........Backend is running........");
  
});
