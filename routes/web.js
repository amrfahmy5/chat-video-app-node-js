const routerProvider = require("express");
const router = routerProvider.Router();
const { isLogin } = require("../middlewares/authMiddleware");
const {webErrorPage} = require("../middlewares/productionErrorReporter");



const {index } = require("../controllers/mainController") ;
const {loginSubmit  , loginIndex} = require("../controllers/signController") ;

router.get("/login",loginIndex);
router.post("/login",loginSubmit);

router.get("/",isLogin,index);



router.use(webErrorPage);
exports.router = router;


