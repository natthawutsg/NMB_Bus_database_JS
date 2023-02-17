//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("./../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const camera_table = database.define(
  // table name
  "data_camera",
  {
    // column list >>>>>>>
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    timestamp: {
      type: Sequelize.DATE,
    },
    mfgdate: {
      type: Sequelize.DATEONLY,
    },
    time: {
      type: Sequelize.TIME,
    },
    rfid: {
      type: Sequelize.STRING,
    },
    emp_no: {
      type: Sequelize.STRING,
    },
    driver_name: {
      type: Sequelize.STRING,
    },
    plate_id: {
      type: Sequelize.STRING,
    },
    vender: {
      type: Sequelize.STRING,
    },
    remark: {
      type: Sequelize.STRING,
    },
    camera_condition: {
      type: Sequelize.STRING,
    },
  },
  {
    //option
    timestamps: false,
  }
);

//True : Delete then Create
//False : Only Check then Create

//ชื่อตั่วแปร await,module.exports  ต้องตรงกับข้างบน
(async () => {
  await camera_table.sync({ force: false });
})();

module.exports = camera_table;
