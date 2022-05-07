module.exports = {
  isLogin: (req, res, next) => {
    if (req?.session?.user?.id) {
      next();
    } else {
      res.redirect("/login");
    }
  }
};
