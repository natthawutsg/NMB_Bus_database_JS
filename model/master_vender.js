//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("./../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const vender_table = database.define(
  // table name
  "master_vender",
  {
    // column list >>>>>>>
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,  
    },
   vender_name: {
      type: Sequelize.STRING,
      allowNull: false,
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
  await vender_table.sync({ force: false });
})();

module.exports = vender_table;
