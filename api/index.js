import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to Mongo");
  })
  .catch((err) => {
    console.error(err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
