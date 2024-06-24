const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config();
const mongo_url = process.env.MONGO_CONNECTION;

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(mongo_url);
    console.log(`Mongodb Connected: ${connect.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

module.exports = connectDB;
