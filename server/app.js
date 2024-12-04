const express = require("express");
const app = express();
const morgan = require("morgan");
const printerRoutes = require("./routes/printerRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/printers", printerRoutes);
app.use("/api/v1/routers", userRoutes);
module.exports = app;
