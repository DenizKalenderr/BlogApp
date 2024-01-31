const express = require("express");

const app = express();

app.set("view engine", "ejs");

// const { Pool } = require('pg');
// const config = require("./config");

const path = require("path");
const userRoute = require("./routes/user");
const adminRoutes = require("./routes/admin")

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(userRoute);

app.listen(3000, function () {
    console.log("listening on port 3000");
});