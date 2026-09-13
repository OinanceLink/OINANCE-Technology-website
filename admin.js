/* =====================================================
   OINANCE ADMIN DASHBOARD
   SUPABASE NEWS + IMAGE/VIDEO UPLOAD
===================================================== */


/* =====================================================
   SUPABASE CONNECTION
===================================================== */

const SUPABASE_URL = "https://ieqgrgklofmesatrycwq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_vGQOCmoq7a8FgIHY6yIofg_uIl4P4yJ";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


/* =====================================================
   SETTINGS
===================================================== */

const NEWS_TABLE = "news";

const IMAGE_BUCKET = "news-images";


/* =====================================================
   ELEMENTS
===================================================== */

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

const imageMediaButton =
  document.getElementById("imageMediaButton");

const videoMediaButton =
  document.getElementById("videoMediaButton");


/* =====================================================
   NAVIGATION
===================================================== */

function showPage(pageName) {

  pages.forEach(function(page) {

    page.classList.remove("active");

  });


  const selectedPage =
    document.getElementById(
      pageName + "Page"
    );


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

  link.addEventListener(
    "click",
    function() {

      showPage(link.dataset.page);

    }
  );

});


pageLinks.forEach(function(link) {

  link.addEventListener(
    "click",
    function() {

      showPage(link.dataset.pageLink);

    }
  );

});


/* =====================================================
   OPEN EDITOR
===================================================== */

function openEditor() {

  showPage("news");


  if (newsEditor) {

    newsEditor.classList.add("show");

  }


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


/* =====================================================
   CLOSE EDITOR
===================================================== */

if (cancelEditor) {

  cancelEditor.addEventListener(
    "click",
    function() {

      if (newsEditor) {

        newsEditor.classList.remove("show");

      }


      if (adminNewsForm) {

        adminNewsForm.reset();

      }


      const author =
        document.getElementById("adminAuthor");


      if (author) {

        author.value =
          "OINANCE Editorial";

      }

    }
  );

}


/* =====================================================
   UPLOAD FILE TO SUPABASE STORAGE
===================================================== */

async function uploadFile(
  file,
  folder
) {

  if (!file) {

    return null;

  }


  const fileExtension =
    file.name.includes(".")
      ? file.name
          .split(".")
          .pop()
          .toLowerCase()
      : "file";


  const safeName =
    file.name
      .replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );


  const uniqueName =
    Date.now()
    + "-"
    + Math.random()
        .toString(36)
        .substring(2, 9)
    + "-"
    + safeName;


  const filePath =
    folder + "/" + uniqueName;


  const { error } =
    await supabaseClient
      .storage
      .from(IMAGE_BUCKET)
      .upload(
        filePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type
        }
      );


  if (error) {

    throw error;

  }


  const { data } =
    supabaseClient
      .storage
      .from(IMAGE_BUCKET)
      .getPublicUrl(filePath);


  return data.publicUrl;

}


/* =====================================================
   PUBLISH NEWS
===================================================== */

if (adminNewsForm) {

  adminNewsForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();


      const title =
        document
          .getElementById("adminTitle")
          .value
          .trim();


      const category =
        document
          .getElementById("adminCategory")
          .value;


      const author =
        document
          .getElementById("adminAuthor")
          .value
          .trim();


      const story =
        document
          .getElementById("adminStory")
          .value
          .trim();


      const imageInput =
        document.getElementById(
          "adminImage"
        );


      const videoInput =
        document.getElementById(
          "adminVideo"
        );


      const imageFile =
        imageInput &&
        imageInput.files
          ? imageInput.files[0]
          : null;


      const videoFile =
        videoInput &&
        videoInput.files
          ? videoInput.files[0]
          : null;


      if (!title || !story) {

        showMessage(
          "Please enter a headline and story."
        );

        return;

      }


      try {

        showMessage(
          "Publishing your OINANCE story..."
        );


        /* =========================
           UPLOAD IMAGE
        ========================== */

        let imageUrl = null;


        if (imageFile) {

          if (
            !imageFile.type.startsWith(
              "image/"
            )
          ) {

            throw new Error(
              "Please choose a valid image."
            );

          }


          imageUrl =
            await uploadFile(
              imageFile,
              "images"
            );

        }


        /* =========================
           UPLOAD VIDEO
        ========================== */

        let videoUrl = null;


        if (videoFile) {

          if (
            !videoFile.type.startsWith(
              "video/"
            )
          ) {

            throw new Error(
              "Please choose a valid video."
            );

          }


          /*
             The current bucket is news-images.
             Videos are stored there temporarily
             in a separate folder.

             We can create a dedicated videos
             bucket later.
          */

          videoUrl =
            await uploadFile(
              videoFile,
              "videos"
            );

        }


        /* =========================
           SAVE NEWS ARTICLE
        ========================== */

        const { data, error } =
          await supabaseClient
            .from(NEWS_TABLE)
            .insert({

              title: title,

              category: category,

              author:
                author ||
                "OINANCE Editorial",

              story: story,

              image_url: imageUrl,

              video_url: videoUrl,

              published: true

            })
            .select();


        if (error) {

          throw error;

        }


        console.log(
          "Published article:",
          data
        );


        /* =========================
           SUCCESS
        ========================== */

        showMessage(
          "✓ OINANCE News published successfully."
        );


        adminNewsForm.reset();


        const authorField =
          document.getElementById(
            "adminAuthor"
          );


        if (authorField) {

          authorField.value =
            "OINANCE Editorial";

        }


        if (newsEditor) {

          newsEditor.classList.remove(
            "show"
          );

        }


        await loadArticles();


      } catch (error) {

        console.error(
          "OINANCE publishing error:",
          error
        );


        showMessage(
          "Error: "
          + (
            error.message ||
            "The story could not be published."
          )
        );

      }

    }
  );

}


/* =====================================================
   LOAD ARTICLES FROM SUPABASE
===================================================== */

async function loadArticles() {

  try {

    const { data, error } =
      await supabaseClient
        .from(NEWS_TABLE)
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (error) {

      throw error;

    }


    const articles =
      data || [];


    updateStatistics(
      articles
    );


    renderAdminStories(
      articles
    );


    renderRecentStories(
      articles
    );


  } catch (error) {

    console.error(
      "Could not load OINANCE News:",
      error
    );


    showMessage(
      "News could not be loaded: "
      + error.message
    );

  }

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics(
  articles
) {

  const totalNews =
    document.getElementById(
      "totalNews"
    );


  const technologyNews =
    document.getElementById(
      "technologyNews"
    );


  const totalMedia =
    document.getElementById(
      "totalMedia"
    );


  if (totalNews) {

    totalNews.textContent =
      articles.length;

  }


  if (technologyNews) {

    technologyNews.textContent =
      articles.filter(
        function(article) {

          return (
            article.category ===
            "technology"
          );

        }
      ).length;

  }


  if (totalMedia) {

    let mediaCount = 0;


    articles.forEach(
      function(article) {

        if (article.image_url) {

          mediaCount++;

        }


        if (article.video_url) {

          mediaCount++;

        }

      }
    );


    totalMedia.textContent =
      mediaCount;

  }

}


/* =====================================================
   ADMIN STORY LIST
===================================================== */

function renderAdminStories(
  articles
) {

  const container =
    document.getElementById(
      "adminStories"
    );


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


  articles.forEach(
    function(article) {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "admin-story";


      const date =
        formatDate(
          article.created_at
        );


      item.innerHTML = `

        <div class="admin-story-top">

          <div>

            <h3>
              ${escapeHTML(
                article.title
              )}
            </h3>

            <div class="admin-story-meta">

              ${escapeHTML(
                String(
                  article.category ||
                  "technology"
                ).toUpperCase()
              )}

              ·

              ${escapeHTML(
                article.author ||
                "OINANCE Editorial"
              )}

              ·

              ${escapeHTML(date)}

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

    }
  );


  attachDeleteButtons();

}


/* =====================================================
   DELETE ARTICLE
===================================================== */

function attachDeleteButtons() {

  document
    .querySelectorAll(
      ".delete-button"
    )
    .forEach(
      function(button) {

        button.addEventListener(
          "click",
          async function() {

            const id =
              button.dataset.id;


            const confirmed =
              confirm(
                "Delete this OINANCE News story?"
              );


            if (!confirmed) {

              return;

            }


            try {

              const { error } =
                await supabaseClient
                  .from(NEWS_TABLE)
                  .delete()
                  .eq(
                    "id",
                    id
                  );


              if (error) {

                throw error;

              }


              await loadArticles();


            } catch (error) {

              showMessage(
                "Delete failed: "
                + error.message
              );

            }

          }
        );

      }
    );

}


/* =====================================================
   RECENT STORIES
===================================================== */

function renderRecentStories(
  articles
) {

  const container =
    document.getElementById(
      "recentStories"
    );


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
    .forEach(
      function(article) {

        const item =
          document.createElement(
            "div"
          );


        item.className =
          "recent-story";


        item.innerHTML = `

          <div>

            <h3>
              ${escapeHTML(
                article.title
              )}
            </h3>

            <p>

              ${escapeHTML(
                String(
                  article.category ||
                  "technology"
                ).toUpperCase()
              )}

              ·

              ${escapeHTML(
                formatDate(
                  article.created_at
                )
              )}

            </p>

          </div>


          <span class="setting-value">
            PUBLISHED
          </span>

        `;


        container.appendChild(item);

      }
    );

}


/* =====================================================
   MEDIA BUTTONS
===================================================== */

if (imageMediaButton) {

  imageMediaButton.addEventListener(
    "click",
    function() {

      showPage("news");

      openEditor();


      const imageInput =
        document.getElementById(
          "adminImage"
        );


      if (imageInput) {

        imageInput.click();

      }

    }
  );

}


if (videoMediaButton) {

  videoMediaButton.addEventListener(
    "click",
    function() {

      showPage("news");

      openEditor();


      const videoInput =
        document.getElementById(
          "adminVideo"
        );


      if (videoInput) {

        videoInput.click();

      }

    }
  );

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
  message
) {

  const element =
    document.getElementById(
      "adminMessage"
    );


  if (!element) {

    return;

  }


  element.textContent =
    message;


  if (
    !message.startsWith(
      "Error:"
    )
  ) {

    setTimeout(
      function() {

        element.textContent = "";

      },
      5000
    );

  }

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(
  value
) {

  if (!value) {

    return "";

  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  return date.toLocaleDateString();

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(
  value
) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    value == null
      ? ""
      : value;


  return div.innerHTML;

}


/* =====================================================
   START
===================================================== */

loadArticles();
