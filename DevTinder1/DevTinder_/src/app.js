const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();
app.use(express.json()); // To parse incoming JSON data

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://saurabhbhatt1211:8aMeDjuWoXHJl1kS@cluster023.k38ng.mongodb.net/Devtinder?tls=true"
  );
};

app.post("/signup", async (req, res) => {
  try {
    const user = new User({
      firstName: "Viarat",
      lastName: "kohli",
      emailId: "Saurabhdd122@gmail.com",
      password: "Saurabh@123",
    });

    await user.save();
    console.log("User saved:", user);
    res.send("User Added Successfully");
  } catch (error) {
    res.status(500).send("Error adding user: " + error.message);
  }
});

connectDb()
  .then(() => {
    console.log("Database is established");
    app.listen(7777, () => {
      console.log(`Server is running on http://localhost:7777`);
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected", err);
  });
