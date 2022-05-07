exports.webErrorPage = (err, req, res, next) => {
  if (err) {
    console.log(err)
    res.redirect("/error");
    res.end();
  }
};

exports.ApiErrorPage = (err, req, res, next) => {
  if (err) {
    console.log(err)
    res
      .json({
        msg: "حدث خطأ ما في الخادم",
        status: 500,
      })
      .status(500);
    res.end();
  }
};
