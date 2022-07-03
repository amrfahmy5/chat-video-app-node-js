const { object } = require("joi");
const mainModule = require("../modules/main.module");
const onlineUsers = require("../services/socket.io");
module.exports = {
  async loginIndex (req,res){
    req.session.destroy();
    const viewBag = {
      title: "login",
    };
    res.render("pages.login", viewBag);
  },
  async login (req,res){
    let {username , password } = req.body ;
    let userData = await mainModule.checkLogin(username,password) ;
    if (userData.length == 1)
      {
        console.log(userData[0].id);
        req.session.user_id = userData[0].id;
        req.session.user_name = userData[0].name;
        req.session.user_img = userData[0].img_src;

        res.redirect("/") ;
      }
    else
      res.redirect("/login") ;
  },


  async index(req, res) {
    const viewBag = {
      title: "chat",
      onlineUsers : onlineUsers.users,
      user_id : req.session.user_id
    };
    console.log(onlineUsers.users);
    res.render("pages.home", viewBag);
  },

};
