import express from "express";
import {
  searchGoogle,
  processSearchResults,
  scrapeWebsite,
} from "./scraper.js";

const app = express();
app.use(express.json());

app.post("/search", async (req, res) => {
  const { query } = req.body;
  try {
    const results = await searchGoogle(query);
    console.log("Here are all the links with the query:", query);
    for (const result of results) {
      console.log(result.link);
    }
    res.json(results);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send("An error occurred");
  }
});

app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  try {
    const content = await scrapeWebsite(url);
    res.send(content);
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).send("An error occurred");
  }
});

app.post("/googlesearchandprocess", async (req, res) => {
  const { query } = req.body;
  try {
    await processSearchResults(query);
    res.send("Processing completed");
  } catch (error) {
    console.error("Error during processing:", error);
    res.status(500).send("An error occurred");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
