const mainModule = require("../modules/main.module");
const onlineUsers = require("../services/socket.io");
module.exports = {
  async index(req, res) {
    const viewBag = {
      title: "online chat",
      onlineUsers : onlineUsers.users
    };
    console.log(onlineUsers.users);
    res.render("pages.home", viewBag);
  },
  async login(req, res) {
    const viewBag = {
      title: "set name",
    };
    res.render("pages.login", viewBag);
  }
};
