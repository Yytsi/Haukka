import express from "express";
import { searchGoogle } from "./scraper.js";

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
