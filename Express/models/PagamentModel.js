const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pagament = sequelize.define("Pagament",{
    name:DataTypes.STRING,
    value:DataTypes.FLOAT,
    description:DataTypes.STRING,
    date:DataTypes.DATE

})

module.exports = Pagament