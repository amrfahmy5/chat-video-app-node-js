const { Server } = require("socket.io");
var ios = require('socket.io-express-session');

const mainModule = require("../modules/user.module")
const messageModule = require("../modules/message.module")

let users = [];

module.exports = {
  users,
  async initialize(server, session) {
    const io = new Server();
    io.use(ios(session));
    io.listen(server);
    io.on("connection", (socket) => {

      var sess = socket.handshake.session;
      socket.on("disconnect", async function (data) {
        let index = -1;
        users.find((o, i) => {
          if (o.id === socket.id) {
            index = i;
            return true; // stop searching
          }
        });
        if (index < 0) return;
        const userData = users[index];
        if (index > -1)
          users.splice(index, 1); // 2nd parameter means remove one item only

        mainModule.setOffline(userData.user_id);

        socket.broadcast.emit("user-logout", {
          user_id: userData.user_id,
        });
      });
      socket.on("login", async function (data) {
        let { user_id, user_name, user_img } = sess;
        if(!user_id) return ;
        mainModule.setOnline(user_id);
        users.push({ id: socket.id, user_id, user_name, img: user_img });
        socket.broadcast.emit("user-login", {
          user_id,
        });
        socket.send({
          user_name, user_img ,user_id
        })
      });
      socket.on("typing", function (data) {
        if(!sess.user_id) return ;
        let {receiver_id} = data ;
        const result = {
          sender_id : sess.user_id ,
        }
        if (receiver_id == "0")
          socket.broadcast.emit("typing", result );
        else {
          users.find(o => {
            if (o.user_id == receiver_id) {
              socket.to(o.id).emit("typing", result);
            }
          })
        }
      });
      socket.on("stopTyping", function (data) {
        let {receiver_id} = data ;
        if(!sess.user_id) return ;
        const result = {
          sender_id : sess.user_id ,
          IsPublic:(receiver_id=="0")?true:false
        }
        if (receiver_id == "0")
          socket.broadcast.emit("stopTyping", result );
        else {
          users.find(o => {
            if (o.user_id == receiver_id) {
              socket.to(o.id).emit("stopTyping", result);
            }
          })
        }
      });
      socket.on("send_message", function (data) {
        let receiver_id = data.receiver_id;
        let { user_id, user_name, user_img } = sess;
        if(!user_id) return ;
        const result_date = {
          message_content: data.message_content,
          message_time: data.message_time,
          sender_id: user_id,
          sender_name: user_name,
          sender_img: user_img,
          IsPublic:(receiver_id=="0")?true:false
        }
        messageModule.saveMessage(user_id,receiver_id,data.message_content)
        if (receiver_id == "0")
          socket.broadcast.emit("receive_message", result_date);
        else {
          users.find(o => {
            if (o.user_id == receiver_id) 
              socket.to(o.id).emit("receive_message", result_date);
            
          })
        }

      });
      socket.on("readMessage", async function (data) {
        if(!sess.user_id) return ;
        let {sender_id} = data ;
        messageModule.setReaded(sender_id,sess.user_id);
        users.find(o => {
          if (o.user_id == sender_id) 
            socket.to(o.id).emit("setReaded", {"sender_id":sess.user_id});          
        })
      });
    });
  },
};
