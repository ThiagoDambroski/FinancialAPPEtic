const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const PostMessage = sequelize.define("PostMessage",{
    message:DataTypes.STRING,
    likes:DataTypes.INTEGER
})

module.exports = PostMessage