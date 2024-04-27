const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000; // Or any port you prefer

const framerSiteUrl = "https://about.peable.co/FairCoin";

// Function to recursively remove "/FairCoin" from HTML content
function removeFairCoin(html) {
  const $ = cheerio.load(html);

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

// Route handlers
app.get("/", async (req, res) => {
  try {
    // Fetch content from your Framer site
    const response = await axios.get(framerSiteUrl);
    let modifiedHtml = removeFairCoin(response.data);

    // Integrate the JavaScript script
    modifiedHtml += `
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    // Find all links and prevent their default behavior
                    var links = document.querySelectorAll("a");
                    links.forEach(function(link) {
                        link.addEventListener("click", function(event) {
                          console.log("WORKS?");
                            event.preventDefault(); // Prevent the default behavior
                            var href = link.getAttribute("href");
                            // Modify the URL as desired (e.g., remove "/FairCoin")
                            var newHref = href.replace(/\\/FairCoin/g, '');
                            window.location.href = newHref;
                        });
                    });
                });
            </script>
        `;

    res.send(modifiedHtml); // Send the modified HTML with script
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching content");
  }
});

app.get("/wallet", async (req, res) => {
  try {
    // Fetch content from your Framer site
    const response = await axios.get("https://about.peable.co/FairCoin/wallet");
    let modifiedHtml = removeFairCoin(response.data);

    // Integrate the JavaScript script
    modifiedHtml += `
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    // Find all links and prevent their default behavior
                    var links = document.querySelectorAll("a");
                    links.forEach(function(link) {
                        link.addEventListener("click", function(event) {
                          console.log("WORKS?");
                            event.preventDefault(); // Prevent the default behavior
                            var href = link.getAttribute("href");
                            // Modify the URL as desired (e.g., remove "/FairCoin")
                            var newHref = href.replace(/\\/FairCoin/g, '');
                            window.location.href = newHref;
                        });
                    });
                });
            </script>
        `;

    res.send(modifiedHtml); // Send the modified HTML with script
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching content");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
