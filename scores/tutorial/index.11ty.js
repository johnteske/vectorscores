module.exports = class {
  data() {
    return {
      layout: "score",
      title: "tutorial",
      status: "test",
      info:
        "Close the info modal by clicking away, clicking the close button in the top right, or by pressing the escape key.",
      options:
        "Close the options modal by clicking away, clicking the close button in the top right, or by pressing the escape key.",
    };
  }

  render(data) {
    return `<div class="tutorial-message">
        <p>Click the play button in the footer or press spacebar to start.</p>
        <p>If the footer is not visible, tap or hover over the bottom of the page to make it reappear.</p>
        </div>`;
  }
};
