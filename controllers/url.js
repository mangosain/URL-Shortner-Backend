const shortid = require("shortid");
const URL = require("../models/url.js");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortID = shortid();
  await URL.create({
    shortID: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.status(201).json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.query.shortId;
  const entry = await URL.findOne({ shortId });

  if (!entry) {
    return res.status(404).json({ error: "URL not found" });
  }

  return res.status(200).json({
    totalClicks: entry.visitHistory.length,
    visitHistory: entry.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
