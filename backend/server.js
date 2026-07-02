const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });
  
app.use("/leads", leadRoutes);
app.use("/auth", authRoutes);
app.use("/activities", activityRoutes);
app.get("/", (req, res) => {
  res.send("CRM Backend Running");
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});