const defaultTemplate = require("./default.11ty.js");

module.exports = data => {
  const pageContent = `<article class="post">
    <header class="post-header">
        <h1 class="post-title">${data.title}</h1>
    </header>
    <div class="post-content">
        ${data.content}
    </div>
  </article>`;

  return defaultTemplate({ ...data, content: pageContent });
};
