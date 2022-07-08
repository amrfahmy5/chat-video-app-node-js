const {checkLogin} = require("../modules/sign.module");
module.exports = {
  async loginIndex (req,res){
    req.session.destroy();
    const viewBag = {
      title: "login",
    };
    res.render("pages.login", viewBag);
  },
  async loginSubmit (req,res){
    let {username , password } = req.body ;
    let userData = await checkLogin(username,password) ;
    if (userData.length == 1)
      {
        console.log(userData[0].id);
        req.session.user_id = userData[0].id;
        req.session.user_name = userData[0].name;
        req.session.user_img = userData[0].img_src;

        res.redirect("/video") ;
      }
    else
      res.redirect("/login") ;
  },

};
