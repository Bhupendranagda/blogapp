const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const path = require("path");
const conn = require("./db/connect.js");
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "./client/build")));

// routes
const userRoutes = require("./routes/userRoutes.js");
const blogRoutes = require("./routes/blogRoutes.js");
app.use(`/api/v1/user`, userRoutes);
app.use(`/api/v1/blog`, blogRoutes);

app.get("*", function (req, res) {
  res.sendfile(path.join(__dirname, "./client/build/index.html"));
});
const PORT = process.env.PORT || 5000;
const DEV_MODE = process.env.DEV_MODE;

// mongodb connection
conn
  .then((db) => {
    if (!db) return process.exit(1);

    // listen
    app.listen(PORT, () => {
      console.log(
        `Server Runnning on ${DEV_MODE} PORT ${PORT}`.bgMagenta.white
      );
    });

    app.on("error", (err) =>
      console.log(`Failed to Connect with HTTP Server: ${err}`.bgRed.white)
    );
    //error in mongodb connection
  })
  .catch((error) => {
    console.log(`Connection Failed!! ${error}`);
  });
