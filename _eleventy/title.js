const titles =  (siteTitle, title) => [siteTitle, title].filter(Boolean)
const joinTitles = t => t.join(" | ")

const pageTitle = (siteTitle, title) => joinTitles(titles(siteTitle, title))
const scoreTitle = (siteTitle, title) => joinTitles(titles(siteTitle, title).reverse())

module.exports = {
    pageTitle: pageTitle,
    scoreTitle: scoreTitle
}
