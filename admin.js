/* =========================
   OINANCE ADMIN DASHBOARD
========================= */

const STORAGE_KEY = "oinanceNews";

let articles = JSON.parse(
  localStorage.getItem(STORAGE_KEY)
) || [];


/* =========================
   ELEMENTS
========================= */

const sidebarLinks =
  document.querySelectorAll(".sidebar-link");

const pages =
  document.querySelectorAll(".admin-page");

const pageLinks =
  document.querySelectorAll("[data-page-link]");

const newsEditor =
  document.getElementById("newsEditor");

const createNewsButton =
  document.getElementById("createNewsButton");

const newStoryButton =
  document.getElementById("newStoryButton");

const cancelEditor =
  document.getElementById("cancelEditor");

const adminNewsForm =
  document.getElementById("adminNewsForm");


/* =========================
   NAVIGATION
========================= */

function showPage(pageName) {

  pages.forEach(function(page) {

    page.classList.remove("active");

  });


  const selectedPage =
    document.getElementById(pageName + "Page");


  if (selectedPage) {

    selectedPage.classList.add("active");

  }


  sidebarLinks.forEach(function(link) {

    link.classList.remove("active");

    if (link.dataset.page === pageName) {

      link.classList.add("active");

    }

  });

}


sidebarLinks.forEach(function(link) {

  link.addEventListener("click", function() {

    showPage(link.dataset.page);

  });

});


pageLinks.forEach(function(link) {

  link.addEventListener("click", function() {

    showPage(link.dataset.pageLink);

  });

});


/* =========================
   OPEN NEWS EDITOR
========================= */

function openEditor() {

  showPage("news");

  newsEditor.classList.add("show");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


if (createNewsButton) {

  createNewsButton.addEventListener(
    "click",
    openEditor
  );

}


if (newStoryButton) {

  newStoryButton.addEventListener(
    "click",
    openEditor
  );

}


/* =========================
   CLOSE EDITOR
========================= */

if (cancelEditor) {

  cancelEditor.addEventListener(
    "click",
    function() {

      newsEditor.classList.remove("show");

      if (adminNewsForm) {
        adminNewsForm.reset();
      }

    }
  );

}


/* =========================
   PUBLISH NEWS
========================= */

if (adminNewsForm) {

  adminNewsForm.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const title =
        document.getElementById("adminTitle")
        .value
        .trim();


      const category =
        document.getElementById("adminCategory")
        .value;


      const author =
        document.getElementById("adminAuthor")
        .value
        .trim();


      const story =
        document.getElementById("adminStory")
        .value
        .trim();


      const image =
        document.getElementById("adminImage")
        .value
        .trim();


      const video =
        document.getElementById("adminVideo")
        .value
        .trim();


      if (!title || !story) {

        showMessage(
          "Please enter a headline and story."
        );

        return;

      }


      const newArticle = {

        id: Date.now(),

        title: title,

        category: category,

        author:
          author || "OINANCE Editorial",

        story: story,

        image: image,

        video: video,

        date:
          new Date().toLocaleDateString()

      };


      articles.unshift(newArticle);


      saveArticles();


      adminNewsForm.reset();


      document.getElementById(
        "adminAuthor"
      ).value = "OINANCE Editorial";


      newsEditor.classList.remove("show");


      showMessage(
        "✓ Story published successfully."
      );


      renderEverything();

    }
  );

}


/* =========================
   SAVE
========================= */

function saveArticles() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(articles)
  );

}


/* =========================
   MESSAGE
========================= */

function showMessage(message) {

  const element =
    document.getElementById("adminMessage");


  if (!element) {
    return;
  }


  element.textContent = message;


  setTimeout(function() {

    element.textContent = "";

  }, 4000);

}


/* =========================
   STATISTICS
========================= */

function updateStatistics() {

  const totalNews =
    document.getElementById("totalNews");


  const technologyNews =
    document.getElementById("technologyNews");


  const totalMedia =
    document.getElementById("totalMedia");


  if (totalNews) {

    totalNews.textContent =
      articles.length;

  }


  if (technologyNews) {

    technologyNews.textContent =
      articles.filter(function(article) {

        return article.category === "technology";

      }).length;

  }


  if (totalMedia) {

    let mediaCount = 0;

    articles.forEach(function(article) {

      if (article.image) {
        mediaCount++;
      }

      if (article.video) {
        mediaCount++;
      }

    });

    totalMedia.textContent =
      mediaCount;

  }

}


/* =========================
   ADMIN STORY LIST
========================= */

function renderAdminStories() {

  const container =
    document.getElementById("adminStories");


  if (!container) {
    return;
  }


  container.innerHTML = "";


  if (articles.length === 0) {

    container.innerHTML = `

      <div class="empty-state">

        <strong>
          No published stories
        </strong>

        <p>
          Create your first OINANCE News story.
        </p>

      </div>

    `;

    return;

  }


  articles.forEach(function(article) {

    const item =
      document.createElement("div");


    item.className =
      "admin-story";


    item.innerHTML = `

      <div class="admin-story-top">

        <div>

          <h3>
            ${escapeHTML(article.title)}
          </h3>

          <div class="admin-story-meta">

            ${article.category.toUpperCase()}
            ·
            ${escapeHTML(article.author)}
            ·
            ${article.date}

          </div>

        </div>


        <button
          class="delete-button"
          data-id="${article.id}"
        >
          DELETE
        </button>

      </div>

    `;


    container.appendChild(item);

  });


  attachDeleteButtons();

}


/* =========================
   DELETE
========================= */

function attachDeleteButtons() {

  document
    .querySelectorAll(".delete-button")
    .forEach(function(button) {

      button.addEventListener(
        "click",
        function() {

          const id =
            Number(button.dataset.id);


          const confirmed =
            confirm(
              "Delete this OINANCE News story?"
            );


          if (!confirmed) {
            return;
          }


          articles =
            articles.filter(function(article) {

              return article.id !== id;

            });


          saveArticles();

          renderEverything();

        }
      );

    });

}


/* =========================
   RECENT STORIES
========================= */

function renderRecentStories() {

  const container =
    document.getElementById("recentStories");


  if (!container) {
    return;
  }


  container.innerHTML = "";


  if (articles.length === 0) {

    container.innerHTML = `

      <div class="empty-state">

        <strong>
          No stories yet
        </strong>

        <p>
          Your published news articles will appear here.
        </p>

      </div>

    `;

    return;

  }


  articles
    .slice(0, 5)
    .forEach(function(article) {

      const item =
        document.createElement("div");


      item.className =
        "recent-story";


      item.innerHTML = `

        <div>

          <h3>
            ${escapeHTML(article.title)}
          </h3>

          <p>
            ${article.category.toUpperCase()}
            ·
            ${article.date}
          </p>

        </div>

        <span class="setting-value">
          PUBLISHED
        </span>

      `;


      container.appendChild(item);

    });

}


/* =========================
   MEDIA BUTTONS
========================= */

const imageMediaButton =
  document.getElementById("imageMediaButton");


const videoMediaButton =
  document.getElementById("videoMediaButton");


if (imageMediaButton) {

  imageMediaButton.addEventListener(
    "click",
    function() {

      showPage("news");

      openEditor();

      document
        .getElementById("adminImage")
        .focus();

    }
  );

}


if (videoMediaButton) {

  videoMediaButton.addEventListener(
    "click",
    function() {

      showPage("news");

      openEditor();

      document
        .getElementById("adminVideo")
        .focus();

    }
  );

}


/* =========================
   HTML ESCAPE
========================= */

function escapeHTML(value) {

  const div =
    document.createElement("div");

  div.textContent =
    value;

  return div.innerHTML;

}


/* =========================
   EVERYTHING
========================= */

function renderEverything() {

  updateStatistics();

  renderAdminStories();

  renderRecentStories();

}


/* =========================
   START
========================= */

renderEverything();
