const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PagamentCategory = sequelize.define("PagamentCategory",{
    name:DataTypes.STRING,
    
})


module.exports = PagamentCategory