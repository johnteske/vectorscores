const titles =  (siteTitle, title) => [siteTitle, title].filter(Boolean)
const joinTitles = t => t.join(" | ")
//
//const pageTitle
const scoreTitle = (siteTitle, title) => joinTitles(titles(siteTitle, title))
	console.log(scoreTitle, typeof scoreTitle)
module.exports = {
	scoreTitle: scoreTitle
}
//(pageTitle, siteTitle) => titles => 
//module.exports = (pageTitle, siteTitle) => (pageTitle ? `${siteTitle} | ${title}` : site.title);
