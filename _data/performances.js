const { getPerformances } = require("ffdb-jtm")

module.exports = async function() {
  return await getPerformances()
}
