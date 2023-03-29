//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const shift_table = database.define(
  // table name
  "master_shift",
  {
    // column list >>>>>>>
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,  
    },
    shift: {
      type: Sequelize.STRING,  
    },
    shift_code: {
      type: Sequelize.STRING,
      primaryKey: true,  
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
  await shift_table.sync({ force: false });
})();

module.exports = shift_table;
