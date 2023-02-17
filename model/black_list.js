//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("./../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const black_list_table = database.define(
  // table name
  "black_list",
  {
    // column list >>>>>>>
    emp_no: {
      type: Sequelize.STRING,
    },
    id_card: {
      type: Sequelize.STRING,
    },
    detail: {
        type: Sequelize.STRING,
      },
   on_date: {
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
  await black_list_table.sync({ force: false });
})();

module.exports = black_list_table;
