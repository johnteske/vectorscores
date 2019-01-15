module.exports = class {
  data() {
    return {
      layout: "default"
    };
  }

  render(data) {
    return `<article class="post">
    <header class="post-header">
        <h1 class="post-title">${data.title}</h1>
    </header>
    <div class="post-content">
        ${data.content}
    </div>
  </article>`;
  }
};
