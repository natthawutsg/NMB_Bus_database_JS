//Reference
const Sequelize = require("sequelize");
//==================================================================================================
// const sequelize = new Sequelize("ld_measurment_data_analyze", "sa", "sa@admin", {
//   server: "localhost",
//   timezone: 'utc+7',
//   dialect: "mssql",
//   dialectOptions: {
//     options: {
//       instanceName: "",
//       encrypt: false,  
//     },
//   },
// });
//==================================================================================================
// My SQL
//Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize("driver_attendance", "admin", "rootadmin", {
  host: "localhost",//not include port
  dialect: "mysql",
  dialectOptions: {
    options: {
      requestTimeout: 300000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
});
//==================================================================================================
(async () => {
  await sequelize.authenticate();


})();
module.exports = sequelize;
