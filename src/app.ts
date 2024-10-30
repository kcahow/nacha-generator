import express, { Express, Request, Response } from "express";
import { generateNachaFile } from "./nachaGenerator";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});
app.listen(3000, () => {
    generateNachaFile(30);
  console.log("Server is running on port 3000");
});
