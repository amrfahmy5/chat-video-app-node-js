const routerProvider = require("express");
const router = routerProvider.Router();
const {index , loginIndex  , login} = require("../controllers/mainController") ;
const { isLogin } = require("../middlewares/authMiddleware");
const {webErrorPage} = require("../middlewares/productionErrorReporter");

router.get("/",isLogin,index);
router.get("/login",loginIndex);
router.post("/login",(login));


router.use(webErrorPage);
exports.router = router;


