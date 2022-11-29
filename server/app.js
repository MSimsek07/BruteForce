const express = require("express"); 
const mongoose = require("mongoose"); 
const router = require("./routes/user-routes"); 
const cors = require("cors"); // Import cors for react
const app = express(); 
require("dotenv").config(); 
// app.use(cors()); 
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
); // Use cors
app.use(express.json());
app.use("/api", router);

mongoose
  .connect(
    "mongodb+srv://defkhan5960:tokat_05_60@atlascluster.kiilmwx.mongodb.net/?retryWrites=true&w=majority" // mongodb connection string
  )
  .then(() => {
    app.listen(5000); 
    console.log("Database connected! Listening on port 5000");
  })
  .catch((err) => console.log(err)); 
