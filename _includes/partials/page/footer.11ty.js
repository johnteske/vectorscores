const fs = require("fs");
const rootPath = require("app-root-path");
const { maybeTemplate } = require(`${rootPath}/render-utils`);

const getRawSVG = basename =>
  fs.readFileSync(`${rootPath}/assets/svg/${basename}.svg`, "utf-8");
const linkListIcon = icon =>
  icon ? `<span class="icon">${getRawSVG(icon).replace("\n", "")}</span>` : "";

const linkListItem = ({ name, url, icon }) =>
  `<li><a href="${url}">
    ${maybeTemplate(
      linkListIcon(icon),
      icon
    )}<span class="username">${name}</span>
  </a></li>`;

module.exports = data => `<footer class="site-footer">
    <div class="wrapper">
        <h4 class="footer-heading vectorscores">${data.site.title}</h4>

        <div class="footer-col-wrapper">
            <div class="footer-col footer-col-1">
                <p>${data.site.description}</p>
            </div>

            <div class="footer-col footer-col-2">
                <ul class="social-media-list">
                ${data.site.links.map(linkListItem).join("")}
                </ul>
            </div>
        </div>
    </div>
</footer>`;
