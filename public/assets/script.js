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