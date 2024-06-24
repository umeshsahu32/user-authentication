const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");

const app = express();
dotenv.config();
connectDB();

app.get("/ping", (req, res) => {
  res.send("Pong");
});

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", AuthRouter);
app.use("/products", ProductRouter);

app.listen(PORT, () => {
  console.log(`Server is Running at port ${PORT}`);
});
