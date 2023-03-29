//Reference
const { Sequelize, DataTypes } = require("sequelize");

//SQL Connection
const database = require("../instance/database");

//Create Table in SQL
//ชื่อตั่วแปร Const ต้องตรงกับข้างล่าง
const data_route_table = database.define(
  // table name
  "data_route",
  {
    // column list >>>>>>>
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,  
    },
    mfgdate: {
      type: Sequelize.DATEONLY,
    },
    shift: {
      type: Sequelize.STRING,
    },
    route: {
      type: Sequelize.STRING,
    }, 
    plate_id: {
      type: Sequelize.STRING,
    }, 
    petrol: {
      type: Sequelize.FLOAT,
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
  await data_route_table.sync({ force: false });
})();

module.exports = data_route_table;
