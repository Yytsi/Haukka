import { chromium } from "playwright";
import fs from "fs";

export async function searchGoogle(query) {
  const browser = await chromium.launch({ headless: true });
  let results = [];
  try {
    const page = await browser.newPage();
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}`;
    console.log("searchUrl:", searchUrl);
    await page.goto(searchUrl);

    results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll("h3"));
      return items.map((item) => ({
        title: item.innerText,
        link: item.parentElement.href,
      }));
    });
  } catch (error) {
    console.error("Failed to search on Google:", error);
  } finally {
    await browser.close();
  }
  return results;
}

export async function scrapeWebsite(url) {
  const browser = await chromium.launch({ headless: true });
  let content = "";
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Evaluate page to return visible text
    content = await page.evaluate(() => {
      const walk = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );
      let text = "";
      let node;
      while ((node = walk.nextNode())) {
        if (
          node.parentElement &&
          getComputedStyle(node.parentElement).display !== "none"
        ) {
          text += node.nodeValue.trim() + " ";
        }
      }
      return text;
    });
  } catch (error) {
    console.error("Failed to scrape website:", error);
  } finally {
    await browser.close();
  }

  console.log(`Scraped content from ${url}:`, content);
  fs.writeFileSync(`scraped_content_${encodeURIComponent(url)}.txt`, content);

  return content;
}

export async function processSearchResults(query) {
  const searchResults = await searchGoogle(query);
  for (const result of searchResults) {
    const textContent = await scrapeWebsite(result.link);
    // Delay here to avoid getting blocked
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Scraped content from ${result.link}:`, textContent);
    // Write also to a file
    fs.writeFileSync(
      `scraped_content_${encodeURIComponent(result.title)}.txt`,
      textContent
    );
  }
}
