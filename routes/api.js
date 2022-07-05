const routerProvider = require("express");
const router = routerProvider.Router();
const {ApiErrorPage} = require("../middlewares/productionErrorReporter")
const {getChat} = require("../controllers/messageController")

router.get("/getChat/:sender_id/:receiver_id",getChat);



router.use(ApiErrorPage);

exports.router = router;
