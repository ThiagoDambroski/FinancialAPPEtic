const sequelize = require('../config/database');

const User = require('./UserModel')
const PostMessage = require("./PostMessageModel")
const Account = require("./AccountModel");
const Income = require('./IncomeModel');
const Pagament = require('./PagamentModel');
const PagamentCategory = require("./PagamentCategory")

//User

User.hasMany(PostMessage, { foreignKey: "UserId" });
PostMessage.belongsTo(User, { foreignKey: "UserId" });
User.hasMany(Account, { foreignKey: "UserId" });
Account.belongsTo(User,{foreignKey:"UserId"})

//Account
Account.hasMany(Income,{foreignKey:"AccountId"})
Income.belongsTo(Account,{foreignKey:"AccountId"})
Account.hasMany(Pagament,{foreignKey:"AccountId"})
Pagament.belongsTo(Account,{foreignKey:"AccountId"})

//Pagament
Pagament.hasMany(PagamentCategory,foreignKey({foreignKey:"PagamentId"}))
PagamentCategory.hasMany(Pagament,foreignKey({foreignKey:"PagamentCategoryId"}))


module.exports = { sequelize, User,PostMessage,Account ,Income,Pagament,PagamentCategory};
