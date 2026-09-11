/* =========================
   OINANCE TECHNOLOGY
   MAIN WEBSITE SCRIPT
========================= */


/* =========================
   MOBILE MENU
========================= */

const menuToggle =
  document.getElementById("menuToggle");

const mainNav =
  document.getElementById("mainNav");


if (menuToggle && mainNav) {

  menuToggle.addEventListener(
    "click",
    function () {

      mainNav.classList.toggle("open");

      const isOpen =
        mainNav.classList.contains("open");

      menuToggle.textContent =
        isOpen ? "✕" : "☰";

      menuToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Close navigation"
          : "Open navigation"
      );

    }
  );


  /* Close menu after selecting a link */

  mainNav
    .querySelectorAll("a")
    .forEach(function (link) {

      link.addEventListener(
        "click",
        function () {

          mainNav.classList.remove("open");

          menuToggle.textContent = "☰";

          menuToggle.setAttribute(
            "aria-label",
            "Open navigation"
          );

        }
      );

    });

}


/* =========================
   CURRENT YEAR
========================= */

const yearElement =
  document.getElementById("year");


if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}


/* =========================
   LOAD OINANCE NEWS
========================= */

/*
   The Admin Dashboard stores published
   stories in the browser's localStorage.

   This function displays those stories
   on the public website when available.
*/

const NEWS_STORAGE_KEY =
  "oinanceNews";


function loadNews() {

  const newsContainer =
    document.getElementById("newsContainer");


  if (!newsContainer) {
    return;
  }


  let articles = [];


  try {

    articles =
      JSON.parse(
        localStorage.getItem(
          NEWS_STORAGE_KEY
        )
      ) || [];

  } catch (error) {

    console.log(
      "OINANCE News could not be loaded."
    );

    return;

  }


  if (!articles.length) {
    return;
  }


  newsContainer.innerHTML = "";


  articles
    .slice(0, 6)
    .forEach(function (article) {

      const card =
        document.createElement("article");


      card.className =
        "news-card";


      /* IMAGE */

      let imageHTML = `

        <div class="news-image">

          <div class="news-placeholder">
            OINANCE
          </div>

        </div>

      `;


      if (article.image) {

        imageHTML = `

          <div class="news-image">

            <img
              src="${escapeHTML(article.image)}"
              alt="${escapeHTML(article.title)}"
              loading="lazy"
            >

          </div>

        `;

      }


      /* VIDEO */

      let videoHTML = "";


      if (article.video) {

        videoHTML = `

          <video
            controls
            playsinline
            preload="metadata"
            style="
              width:100%;
              margin-top:15px;
              border-radius:8px;
            "
          >

            <source
              src="${escapeHTML(article.video)}"
            >

            Your browser does not support video.

          </video>

        `;

      }


      card.innerHTML = `

        ${imageHTML}

        <div class="news-content">

          <span class="news-category">

            ${escapeHTML(
              String(article.category || "Technology")
                .toUpperCase()
            )}

          </span>


          <h3>
            ${escapeHTML(article.title)}
          </h3>


          <p>
            ${escapeHTML(
              shortenText(article.story, 180)
            )}
          </p>


          <span class="news-date">

            ${escapeHTML(
              article.author ||
              "OINANCE Editorial"
            )}

            ·

            ${escapeHTML(
              article.date || ""
            )}

          </span>


          ${videoHTML}

        </div>

      `;


      newsContainer.appendChild(card);

    });

}


/* =========================
   SHORTEN STORY
========================= */

function shortenText(text, maxLength) {

  if (!text) {
    return "";
  }


  if (text.length <= maxLength) {
    return text;
  }


  return (
    text.substring(0, maxLength).trim()
    + "..."
  );

}


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(value) {

  const div =
    document.createElement("div");


  div.textContent =
    value == null ? "" : value;


  return div.innerHTML;

}


/* =========================
   LOAD NEWS
========================= */

loadNews();
