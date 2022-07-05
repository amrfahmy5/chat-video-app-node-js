const { database } = require("../services/db");

module.exports = {
  async saveMessage(sender_id,receiver_id,message_content) {
    return await database.table("message").insert({sender_id,receiver_id,message_content})
  },
  async getChat(sender_id,receiver_id) {
    if(sender_id=="0"||receiver_id=="0") return []; //public group no loaded data
    return await database.table("message")
      .whereIn("message.sender_id",[sender_id,receiver_id]).whereIn("receiver_id",[receiver_id,sender_id]).orderBy("created_time").select("*") ;
  },
  async setReaded(sender_id,receiver_id){
    return await database.table("message").where("sender_id",sender_id).andWhere("receiver_id",receiver_id).update({isReaded:"1",readMessageDate:new Date()})
  },
};
