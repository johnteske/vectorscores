# Bravura

## Encoding Bravura for inlining as data URI

Certain scores rely on the dimensions of rendered fonts for additional calculations.
With `@font-face`, the font will not load before the score begins to render, giving inaccurate calculations.
Detecting the font load may require a polyfill until the CSS font loading API has more support.
In the meantime, the font can be inlined by adding `inline_bravura: true` to a score's frontmatter.

To encode the font, if updated, run:
`openssl base64 -A -in assets/fonts/Bravura.woff > assets/fonts/Bravura-woff-base64`
