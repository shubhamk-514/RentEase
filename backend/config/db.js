const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rentease",
    );
    // console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(
      `MongoDB Connected -> Host: ${conn.connection.host}, Database: ${conn.connection.name}`,
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;
