const routerProvider = require("express");
const router = routerProvider.Router();
const {index , login } = require("../controllers/mainController") ;
const { isLogin } = require("../middlewares/authMiddleware");
const {webErrorPage} = require("../middlewares/productionErrorReporter");

router.get("/",index);
router.get("/login",login);


router.use(webErrorPage);
exports.router = router;


