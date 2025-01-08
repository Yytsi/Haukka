import { chromium } from "playwright";

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
