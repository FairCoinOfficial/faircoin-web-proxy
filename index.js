const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000; // Or any port you prefer

const framerSiteUrl = "https://about.peable.co/FairCoin";

// Function to recursively remove "/FairCoin" from HTML content
function removeFairCoin(html) {
  const $ = cheerio.load(html);

  // Change the favicon
  $("link[rel='icon']").attr("href", "/public/assets/favicon.ico");

  // Remove any rel="alternate" meta tags
  $("meta[rel='alternate']").remove();

  // Remove occurrences of "/FairCoin" from all elements
  $("*").each((index, element) => {
    if ($(element).html()) {
      const newHtml = $(element)
        .html()
        .replace(/\/FairCoin/g, "");
      $(element).html(newHtml);
    }
  });

  // Update the canonical link meta tag
  $("link[rel='canonical']").attr("href", "https://fairco.in/");

  return $.html();
}

// Extract common code into a function
async function fetchAndModifyHtml(url) {
  try {
    const response = await axios.get(url);
    let modifiedHtml = removeFairCoin(response.data);

    // Integrate the JavaScript script
    modifiedHtml += `
        <script>
          window.addEventListener('load', () => {
            window.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
}, true);
          });
        </script>
      `;

    return modifiedHtml;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching content");
  }
}

app.get("/", async (req, res) => {
  try {
    const modifiedHtml = await fetchAndModifyHtml(framerSiteUrl);
    res.send(modifiedHtml);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const modifiedHtml = await fetchAndModifyHtml(
      `https://about.peable.co/FairCoin/${slug}`
    );
    res.send(modifiedHtml);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/:slug1/:slug2", async (req, res) => {
  try {
    const slug1 = req.params.slug1;
    const slug2 = req.params.slug2;
    const modifiedHtml = await fetchAndModifyHtml(
      `https://about.peable.co/FairCoin/${slug1}/${slug2}`
    );
    res.send(modifiedHtml);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use("/public/assets", express.static(__dirname + "/public/assets"));

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
