const { Server } = require("socket.io");
var ios = require('socket.io-express-session');

const mainModule = require("../modules/main.module")
let users = [];

module.exports = {
  users,
  async initialize(server,session) {
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
        if (index > -1) 
          users.splice(index, 1); // 2nd parameter means remove one item only
        
        socket.broadcast.emit("remove_user", {
          name: users[index].name,
          user_id: users[index].user_id,
          id: socket.id,
        });
      });

      socket.on("login", async function (data) {
        let user_id = sess.user_id  ;
        let {name  , img_src} = await mainModule.getUser(user_id) ;
        users.push({  id:socket.id , user_id , name , img:img_src });
        socket.broadcast.emit("new_user", {
          name ,
          id: socket.id,
          user_id ,
          img: img_src,
        });
        // socket.send(`welcome ${socket.name}`);
      });

      socket.on("typing", function (data) {
        socket.broadcast.emit("typing", { id: data.id });
      });
      socket.on("stopTyping", function (data) {
        socket.broadcast.emit("stopTyping", { id: data.id });
      });

      socket.on("new_message", function (data) {
        let reciever_id = data.reciever_id;
        const result_date = {
          messageContent: data.messageContent,
            time: data.time,
            id: socket.id,
            name: socket.name,
            img: socket.img,
            private:(reciever_id==="public")?false:true 
        }
        if (reciever_id==="public")
          socket.broadcast.emit("new_message", result_date);
        else
          socket.to(reciever_id).emit("new_message",result_date);
        
      });


    });
  },
};
