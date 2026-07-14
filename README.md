# dactylo

Typewriter effect in JS using CSS.

Dactylo v0.3.0

By Rémino Rem  
<https://remino.net/>

[Docs](https://remino.net/dactylo/) |
[Code Repo](https://github.com/remino/dactylo) |
[npm Package](https://www.npmjs.com/package/dactylo)

---

<!-- mtoc-start -->

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [API](#api)
- [Development](#development)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- mtoc-end -->

---

## Installation

```sh
npm install dactylo
```

[Back to top](#)

---

## Usage

Apply the effect automatically:

```js
import 'dactylo/auto'
```

Or call it yourself:

```js
import { dactylo } from 'dactylo'

dactylo(document.body)
```

Or configure the groups yourself:

```js
dactylo({
    root: document.querySelector('main'),
    caret: '_',
    prompt: '>',
    startDelay: 600,
    groups: [
        {
            sels: 'h1, h2',
            duration: 600,
        },
        {
            sels: 'p, li',
            interval: 18,
            parallel: true,
        },
    ],
})
```

[Back to top](#)

---

## Options

- `caret`: character shown after the typed output. Default: `_`.
- `prompt`: character shown before typing starts. Default: `>`.
- `root`: parent node to search. Default: `document.body`.
- `showFinalCaret`: keep the caret visible after the final typed character.
  Default: `false`.
- `startDelay`: milliseconds to show the prompt before typing starts. Default:
  `600`.
- `groups`: selector groups to type. By default, headings run first in parallel,
  then body text runs in parallel, then links and controls run in parallel.

Each group accepts:

- `sels`: selector string or array of selector strings.
- `notIn`: parent selectors to exclude.
- `duration`: total milliseconds for each element in the group. Default: `500`.
- `interval`: milliseconds per character. Overrides `duration` when set.
- `parallel`: type all matching elements at once instead of in series.

Add `data-dactylo-skip` to any element that should not be processed.

[Back to top](#)

---

## API

```js
const controller = dactylo(document.body)

controller.state
controller.pause()
controller.play()
controller.playPause()
controller.end()
controller.stop()
controller.reset()

await controller.finished
```

The `finished` promise resolves after all groups complete. The `pause()` and
`play()` methods control an active run, while `playPause()` toggles between
them. The `state` property is `playing`, `paused`, `stopped`, or `ended`. The
`end()` method skips to the completed state. The `reset()` method cancels the
run and returns controlled elements to their starting state with no typed text
visible. The `stop()` method pauses first, then resets. Calling `play()` after
`reset()` or `stop()` starts the same target again.

Dactylo dispatches bubbling custom events on `document.documentElement`:
`dactylo:start`, `dactylo:play`, `dactylo:pause`, `dactylo:reset`,
`dactylo:stop`, and `dactylo:end`. Each event includes the controller and
current state in `event.detail`.

[Back to top](#)

---

## Development

```sh
npm install
npm run dev
npm run build
```

The library source lives in `src/lib`. The documentation site is built with
Astro and lives in the rest of `src`.

Release automation is available through `release-it`. A release runs checks,
builds, publishes the npm package, pushes the release commit and tag, creates a
GitHub release, uploads `dist/*`, then publishes docs:

```sh
npm run release:dry-run
npm run release
```

If docs publishing fails after the package release, rerun it directly:

```sh
npm run docs:publish
```

Before running a real release, make sure `RELEASE_IT_GITHUB_TOKEN` is set and
`npm whoami --registry https://registry.npmjs.org/` passes. Release-it prompts
for an npm OTP when npm requires one.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Make your changes.
4. Run `npm run build`.
5. Commit, push, and open a pull request.

Issues and ideas are welcome.

[Back to top](#)

---

## Licence

Licensed under the ISC licence. See `LICENSE.md`.

[Back to top](#)
