//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("./../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const rfid_table = database.define(
  // table name
  "master_rfid",
  {
    // column list >>>>>>>
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    rfid: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    emp_no: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
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
    employ_date: {
      type: Sequelize.DATEONLY,
    },
    pic1: {
      type: Sequelize.DataTypes.BLOB("long"),
      allowNull: true,
    },
    picType1: {
      type: Sequelize.STRING,
      allowNull: true,
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
  await rfid_table.sync({ force: false });
})();

module.exports = rfid_table;
