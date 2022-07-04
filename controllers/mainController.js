const mainModule = require("../modules/main.module");
module.exports = {
  async index(req, res) {
    const user_id  = req.session.user_id ;
    const viewBag = {
      title: "chat",
      allUsers: await mainModule.getAllUsersExpectMe(user_id) ,
      user_id
    };
    res.render("pages.chat", viewBag);
  },

};
