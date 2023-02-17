//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("./../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const driver_table = database.define(
  // table name
  "master_driver",
  {
    // column list >>>>>>>
    emp_no: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    license_date: {
      type: Sequelize.DATEONLY,
    },
    birth_date: {
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
  await driver_table.sync({ force: false });
})();

module.exports = driver_table;
