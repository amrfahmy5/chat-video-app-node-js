const { database } = require("../services/db");

module.exports = {
  async checkLogin(username , password) {
    return await database.table("users").where("name","=",username)
    .andWhere("password","=",password).select("*") ;
  },
  async getUser(user_id) {
    return await database.table("users").where("id","=",user_id).first() ;
  },
};
