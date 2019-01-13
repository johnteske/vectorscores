const linkListItem = ({ name, url, icon }) =>
  icon
    ? `<li><a href="${url}">
  <span class="icon">
    <img src="/assets/svg/${icon}.svg" />
  </span>
  <span class="username">${name}</span>
</a></li>`
    : `<li><a href="${url}"><span class="username">${name}</span></a></li>`;

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
