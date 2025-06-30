
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Account = sequelize.define("Account",{
    name:DataTypes.STRING,
    value:DataTypes.FLOAT,

})


module.exports = Account