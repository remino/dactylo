# dactylo

Typewriter effect in JS using CSS.

## How to build

- See `remarqueeble` symlinked dir for the kind of docs site using Astro 7 to
  build as well as library bundle using Vite 8.
- Get the source of `dactylo.js` in `demo` symlinked dir.
- Proxy `fonts` and `nav` like how `remarqueeble` and `demo` do.
- Only use `@remino/directive` for styling like `remarqueeble`.
- But override the fonts to use Iosevka like for `dactylo` in `demo`.
- Do not add gradients, borders, rounded corners, or any other unnnecesary
  styling.
- Add README similar to `remarqueeble`.
- npm package must be called `dactylo`, not `@remino/dactylo`.
- Apply `dactylo` effect on all text on any page.
- Site structure should also have "Home" reading from `README`, "Licence"
  reading from `LICENSE`, "Demo", and links to GitHub and npm.
- All site will be in `/dactylo/`, similar to how `remarqueeble` is in
  `/remarqueeble/`.
- Create `.env` and `.env.example` similar to `remarqueeble`.
