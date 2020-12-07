const path = require("path");

module.exports = (data) =>
  data.page.filePathStem.split(path.sep).slice(2, -1).join(path.sep) + path.sep;
