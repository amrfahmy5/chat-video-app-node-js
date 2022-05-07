const { Server } = require("socket.io");

let users = [];

module.exports = {
  users,
  async initialize(server) {
    const io = new Server();
    io.listen(server);

    io.on("connection", (socket) => {
      socket.on("disconnect", function (data) {
        let index = -1;
        users.find((o, i) => {
          if (o.id === socket.id) {
            index = i;
            return true; // stop searching
          }
        });
        if (index > -1) {
          users.splice(index, 1); // 2nd parameter means remove one item only
        }
        socket.broadcast.emit("remove_user", {
          name: socket.name,
          id: socket.id,
        });
      });

      socket.on("set_name", function (data) {
        users.push({ name: data.name, id: socket.id, img: data.img });
        socket.name = data.name;
        socket.img = data.img;
        socket.broadcast.emit("new_user", {
          name: socket.name,
          id: socket.id,
          img: data.img,
        });
        socket.send(`welcome ${socket.name}`);
      });

      socket.on("typing", function (data) {
        socket.broadcast.emit("typing", { name: data.name, id: data.id });
      });
      socket.on("stopTyping", function (data) {
        socket.broadcast.emit("stopTyping", { name: data.name, id: data.id });
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

      socket.on("message", function (message) {
        message = JSON.parse(message);
        if (message.type == "userMessage") {
          socket.broadcast.send(JSON.stringify(message));
          message.type = "myMessage";
          socket.send(JSON.stringify(message));
        }
      });
    });
  },
};
