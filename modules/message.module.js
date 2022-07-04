const { database } = require("../services/db");

module.exports = {
  async saveMessage(sender_id,receiver_id,message_content) {
    return await database.table("message").insert({sender_id,receiver_id,message_content})
  },
//   async getAllUsersExpectMe(user_id) {
//     return await database.table("users").whereNot("id",user_id).select("*") ;
//   },
  async setReaded(sender_id,receiver_id){
    return await database.table("message").where("sender_id",sender_id).andWhere("receiver_id",receiver_id).update({isReaded:"1",readMessageDate:new Date()})
  },
};
