module.exports = class {
  data() {
    return {
      layout: "movement",
      title: "walk reveal",
      composer: "John Teske",
      status: "wip",
      info: `
        <p>
          Travel through the landscape, interpreting small areas of symbols as musical phrases and textures.
          The symbols should not be interpreted one at a time nor should they be taken literally.
        </p>
        <p>
          You may choose to rest at times during your travels to allow room for variety in instrumentation and texture.
        </p>
      `,
      modules: ["dictionary", "bravura"]
    };
  }

  render(data) {
    return ``;
  }
};
