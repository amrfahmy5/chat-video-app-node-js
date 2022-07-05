const { config } = require("dotenv");

const express = require("express");
const socketIO = require("./services/socket.io");
const app = express();
const { static } = require("express");


const helmet = require("helmet"); //sercure for website header
const compression = require("compression"); //decreasing the amount of downloadable data
const morgan = require("morgan");// all request logs show in terminal 
const expressYouch = require("express-youch"); //presenting errors in a developer-friendly way


const apiRoutes = require("./routes/api");
const webRoutes = require("./routes/web");

const bodyParser = require("body-parser");

const cookieParser = require('cookie-parser')
const sess = require("express-session");

config({ cache: process.env["NODE_ENV"] === "production" });


const edge = require("express-edge");
const edgeService = require("./services/edge");
const userModule = require("./modules/user.module");
edgeService(require("edge.js")).init();
edge.config({ cache: true });


app.use(cookieParser());

const sessionMd = sess({
  secret: process.env["secret"],
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }

});

// middlewares
app.use(morgan("dev"));
if(process.env.NODE_ENV === "production"){
  app.use(compression())
}
app.use(helmet());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(sessionMd);  

app.use(static("public"));
app.use(edge.engine);
app.set("views", `${__dirname}/views`);
app.set("view engine", "edge");

// routes
app.use(apiRoutes.router);
app.use(webRoutes.router);
// end routers


if (process.env.NODE_ENV === "development") {
  app.use(expressYouch.errorReporter());
}


const server = app.listen(process.env["port"], process.env["ip"], () =>{
  // userModule.makeAllUserOffline();
  console.log(`server connected at port ${process.env["port"]} - ip ${process.env["ip"]}`);
});

//session for use in ios
socketIO.initialize(server,sessionMd)

process.on("uncaughtException", (err) => {
  console.error(err.stack);
  process.exit(1);
});
