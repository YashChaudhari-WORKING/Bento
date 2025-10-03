const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const port = 7001;

//config
require("./config/DB");

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true, // allow cookies and headers like Authorization
  })
);
//router import
const auth = require("./routes/auth/auth.route");
const workspace = require("./routes/workspace/workspace.route");
const teams = require("./routes/teams/teamCurd.route");

//router middleware
app.use("/api/auth", auth);
app.use("/api/workspace", workspace);
app.use("/api/teams", teams);

app.get("/", (req, res) => {
  res.send("Server is Up and RunnIng!  (-_-)");
});

app.listen(port, () => {
  console.log("Server Is Online...");
});
