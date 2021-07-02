const path = require("path");

const findit = require("findit");
const rollup = require("rollup");
async function getScoreScripts() {
  return new Promise((resolve, reject) => {
    const finder = findit(".scores");

    const scoreScripts = [];

    finder.on("file", (file) => {
      if (path.basename(file) !== "index.js") {
        return;
      }
      scoreScripts.push(file);
    });

    finder.on("end", () => {
      resolve(scoreScripts);
    });

    finder.on("error", reject);
  });
}

const outputOptions = {
  dir: "_site",
  format: "iife",
};

async function build() {
  const vsScriptInput = {
    "assets/js/vectorscores": "assets/js/vectorscores.js",
  };
  const scoreScripts = await getScoreScripts();
  const inputs = [
    vsScriptInput,
    ...scoreScripts.map((src) => {
      const out = path.format({
        dir: path.dirname(src).split(path.sep).slice(1).join(path.sep),
        base: "index",
      });
      return { [out]: src };
    }),
  ];
  console.log(`${process.argv[1]}\nGenerating ${inputs.length} bundles...`);
  inputs.forEach(async (input) => {
    const bundle = await rollup.rollup({ input });
    console.log(` => ${Object.keys(input)[0]}`);
    await bundle.write(outputOptions);
  });
}

build();
