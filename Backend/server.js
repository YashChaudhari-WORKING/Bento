const express = require("express");
const app = express();
const port = 7001;

app.get("/", (req, res) => {
  res.send("Server is Up and RunnIng!  (-_-)");
});
app.listen(port, () => {
  console.log("Server Is Online...");
});
