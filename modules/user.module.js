const { database } = require("../services/db");

module.exports = {
  async getUser(user_id) {
    return await database.table("users").where("id","=",user_id).first() ;
  },
  async getAllUsersExpectMe(user_id) {
    return await database.table("users").whereNot("id",user_id).select("*") ;
  },
  async setOnline(user_id){
    return await database.table("users").where("id",user_id).update({online:"1"})
  },
  async setOffline(user_id){
    return await database.table("users").where("id",user_id).update({online:"0",lastOnlineDate:new Date()})
  },
  async makeAllUserOffline(){
    return await database.table("users").whereNot("id","0").update({online:"0"})

  }
};
