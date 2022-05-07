const routerProvider = require("express");
const router = routerProvider.Router();
const {ApiErrorPage} = require("../middlewares/productionErrorReporter")

router.use(ApiErrorPage);

exports.router = router;
