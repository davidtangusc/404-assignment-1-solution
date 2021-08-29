function renderWithDOMPurify(posts) {
  let html = "";

  posts.forEach((post) => {
    html += `
      <div>
        <h3>
          <a href="${post.data.url}">${post.data.title}</a>
        </h3>
        <p>Score: ${post.data.score}</p>
        <p>Author: ${post.data.author}</p>
      </div>
    `;
  });

  const sanitizedHtml = DOMPurify.sanitize(html);
  $("#results").html(sanitizedHtml);
}

function renderWithNodes(posts) {
  const div = document.createElement("div");

  posts.forEach((post) => {
    const h3 = document.createElement("h3");
    const a = document.createElement("a");

    a.href = post.data.url;
    a.textContent = post.data.title;

    h3.append(a);
    div.append(h3);

    const score = document.createElement("p");
    score.textContent = `Score: ${post.data.score}`;
    div.append(score);

    const author = document.createElement("p");
    author.textContent = `Author: ${post.data.author}`;
    div.append(author);
  });

  $("#results").html(div);
}

$("form").on("submit", function (event) {
  event.preventDefault(); // prevents the form from submitting to another page

  const subreddit = $("input#search").val();

  $("#results").html('<div class="loader">Loading...</div>');

  $.ajax({
    type: "GET",
    url: `https://www.reddit.com/r/${subreddit}.json`,
  }).then(
    (response) => {
      const posts = response.data.children;

      if (posts.length === 0) {
        $("#results").html("<p>No results found.</p>");
      } else {
        // toggle these two depending on which rendering approach you want to see in action
        renderWithDOMPurify(posts);
        // renderWithNodes(posts);
      }
    },
    () => {
      $("#results").html(
        "<p>Oops! Something went wrong. Please try again later.</p>"
      );
    }
  );
});
