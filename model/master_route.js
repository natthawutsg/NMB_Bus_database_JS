//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const route_table = database.define(
  // table name
  "master_route",
  {
    // column list >>>>>>>
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,  
    },
    route: {
      type: Sequelize.STRING,
    },
   vender_name: {
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
  await route_table.sync({ force: false });
})();

module.exports = route_table;
