const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./router/api/users"));
app.use("/api/auth", require("./router/api/auth"));
app.use("/api/profile", require("./router/api/profile"));
app.use("/api/posts", require("./router/api/posts"));

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "public", "index.html"));
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Listening on port 5000");
});
