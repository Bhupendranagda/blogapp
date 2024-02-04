const mongoose = require("mongoose");
const colors = require("colors");

const conn = mongoose
  .connect(process.env.MONGO_URI)
  .then((db) => {
    console.log(`Database Connected !!!`.bgGreen.white);
    return db;
  })
  .catch((err) => {
    console.log("Connected Error".bgRed.white);
  });

module.exports = conn;
