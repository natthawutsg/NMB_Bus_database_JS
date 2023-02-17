//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const driver_table_achive = database.define(
  // table name
  "achive_driver",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    date_record: {
      type: Sequelize.DATEONLY,
    },
    date_archive: {
      type: Sequelize.DATEONLY,
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
    license_date: {
      type: Sequelize.DATEONLY,
    },
    birth_date: {
      type: Sequelize.DATEONLY,
    },
    employ_date: {
      type: Sequelize.DATEONLY,
    },
    remark: {
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
  await driver_table_achive.sync({ force: false });
})();

module.exports = driver_table_achive;
