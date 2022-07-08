const userModule = require("../modules/user.module");
module.exports = {
  async index(req, res) {
    const user_id  = req.session.user_id ;
    const viewBag = {
      title: "chat",
      allUsers: await userModule.getAllUsersExpectMe(user_id) ,
      user_id
    };
    res.render("pages.chat", viewBag);
  },
  async videoChat(req, res) {
    const user_id  = req.session.user_id ;
    const viewBag = {
      title: "chat video",
      // allUsers: await userModule.getAllUsersExpectMe(user_id) ,
      user_id
    };
    res.render("pages.videoChat", viewBag);
  },

};
