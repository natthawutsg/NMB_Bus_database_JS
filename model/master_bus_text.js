//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const bus_table = database.define(
  // table name
  "master_bus_text",
  {
    // column list >>>>>>>
    plate_id: {
      type: Sequelize.STRING,
    },
    vender: {
      type: Sequelize.STRING,
    },
    name_bu: {
      type: Sequelize.STRING,
    },
    name_owner: {
      type: Sequelize.STRING,
    },
    date_tax: {
      type: Sequelize.DATEONLY,
    },
    date_inspection: {
      type: Sequelize.DATEONLY,
    },
    date_insurance: {
      type: Sequelize.DATEONLY,
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
  await bus_table.sync({ force: false });
})();

module.exports = bus_table;
