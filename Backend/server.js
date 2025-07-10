const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 7001;

//config
require("./config/DB");

//middleware
app.use(express.json());
app.use(cookieParser());

//router import
const auth = require("./routes/auth/auth.route");

//router middleware
app.use("/api/auth", auth);

app.get("/", (req, res) => {
  res.send("Server is Up and RunnIng!  (-_-)");
});

app.listen(port, () => {
  console.log("Server Is Online...");
});
