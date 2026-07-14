# CHANGELOG

<!-- mtoc-start -->

- [HEAD](#head)
- [v0.2.0](#v020)
- [v0.1.0](#v010)

<!-- mtoc-end -->

## HEAD

- Site
    - Add demo controls for controller playback methods.
    - Use an inline menu list for demo playback controls.
- Library
    - Add `state`, `pause()`, `play()`, `playPause()`, `end()`, `reset()`, and
      `stop()` to Dactylo controllers.
    - Emit lifecycle and playback events with controller state details.
    - Prevent `end()` from adding a prompt caret after an animation has ended.
    - Make controller `reset()` and `stop()` return text to its hidden starting
      state instead of restoring the finished text.
    - Allow `play()` after `reset()` or `stop()` to start the target again.

## v0.2.0

- Site
    - Use the shared copy button helper without local fallback behavior.
    - Wrap Markdown code blocks and add copy buttons to them.
- Library
    - Keep typed output aligned with padded elements such as code blocks.
    - Hide the caret on the final typed character by default, with a
      `showFinalCaret` option to keep it visible.
    - Prevent quick Dactylo restarts from nesting output fragments or restoring
      stale text.
- Development
    - Add Husky, lint-staged, changelog helpers, and release-it scripts.

## v0.1.0

- Library
    - Add the Dactylo typewriter effect based on the demo implementation.
    - Add ESM, CommonJS, auto, and UMD distribution builds.
- Site
    - Add the Astro documentation site, README, licence, and demo page.
