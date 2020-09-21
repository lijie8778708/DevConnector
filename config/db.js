const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const mongoDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoDB;
