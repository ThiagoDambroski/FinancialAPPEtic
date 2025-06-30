const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Income = sequelize.define("Income",{
    name:DataTypes.STRING,
    value:DataTypes.FLOAT,
    description:DataTypes.STRING,
    date:DataTypes.DATE

})

module.exports = Income