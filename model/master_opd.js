//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("./../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const opd_table = database.define(
  // table name
  "master_opd",
  {
    // column list >>>>>>>
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    warning: {
      type: Sequelize.STRING,
    },
    expire: {
      type: Sequelize.STRING,
    },
    notify: {
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
