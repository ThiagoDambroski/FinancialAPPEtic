const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const User = sequelize.define("User",{
    name:DataTypes.STRING,
    age:DataTypes.INTEGER,
    email:DataTypes.STRING
})

module.exports = User;
