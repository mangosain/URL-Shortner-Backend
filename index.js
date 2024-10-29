require("dotenv").config();

const express = require("express");
const { connectToMongoDB } = require("./connect.js");
const urlRoute = require("./routes/url.js");
const URL = require("./models/url.js");

const app = express();
const PORT = 8001;

connectToMongoDB(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(process.env.MONGO_URL);
  });

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortID", async (req, res) => {
  const shortId = req.params.shortID;

  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );

  return res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
