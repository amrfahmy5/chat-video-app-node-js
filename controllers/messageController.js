const messageModule = require("../modules/message.module");
module.exports = {
  getChat : async (req,res)=>{
    let {sender_id,receiver_id} = req.params ;
    let messageData = await messageModule.getChat(sender_id,receiver_id);
    res.status = 200 ;
    res.send(messageData)
  }
};
