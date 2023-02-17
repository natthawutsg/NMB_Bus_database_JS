//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("./../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const opd_table = database.define(
  // table name
  "data_opd",
  {
    // column list >>>>>>>
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    plate_id: {
      type: Sequelize.STRING,
    },
    mfgdate: {
      type: Sequelize.DATEONLY,
    },
    vender: {
      type: Sequelize.STRING,
    },
    opd_category: {
      type: Sequelize.STRING,
    },
    item: {
      type: Sequelize.STRING,
    },
    qty: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.FLOAT,
    },
    detail: {
      type: Sequelize.STRING,
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
  await opd_table.sync({ force: false });
})();

module.exports = opd_table;
