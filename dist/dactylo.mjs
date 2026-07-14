/*! dactylo v0.2.0 | (c) 2026 Rémino Rem <https://remino.net/> | ISC Licence */
//#region src/lib/dactylo.ts
var STYLE_ID = "dactylo-style";
var SKIP_SELECTOR = "script,style,noscript,template,textarea,input,select,option,[data-dactylo-skip],[data-dactylo-original],[data-dactylo-output]";
var DEFAULT_GROUPS = [
	{
		sels: "h1,h2,h3,h4,h5,h6",
		duration: 600,
		parallel: true
	},
	{
		sels: "p,li,dt,dd,figcaption,blockquote,pre,th,td,caption",
		parallel: true
	},
	{
		sels: "code,a,button,label,summary,mark",
		parallel: true
	}
];
var DEFAULT_CARET = "_";
var DEFAULT_PROMPT = ">";
var DEFAULT_START_DELAY = 600;
var DEFAULT_DURATION = 500;
var DEFAULT_SHOW_FINAL_CARET = false;
var activeElements = /* @__PURE__ */ new WeakMap();
var nextPreparedId = 0;
var activeRunId = 0;
var getRoot = (root) => root ?? globalThis.document?.body ?? null;
var getDocument = (root) => {
	if ("ownerDocument" in root && root.ownerDocument) return root.ownerDocument;
	if ("nodeType" in root && root.nodeType === root.DOCUMENT_NODE) return root;
	return globalThis.document ?? null;
};
var toSelector = (selectors) => Array.isArray(selectors) ? selectors.join(",") : selectors;
var createPlaybackState = () => ({
	ended: false,
	paused: false,
	pausedDuration: 0,
	pausedStarted: 0,
	stopped: false
});
var getPausedDuration = (state) => state.paused ? state.pausedDuration + Date.now() - state.pausedStarted : state.pausedDuration;
var pausePlayback = (state) => {
	if (state.ended || state.paused || state.stopped) return false;
	state.paused = true;
	state.pausedStarted = Date.now();
	return true;
};
var playPlayback = (state) => {
	if (!state.paused || state.ended || state.stopped) return false;
	state.paused = false;
	state.pausedDuration += Date.now() - state.pausedStarted;
	state.pausedStarted = 0;
	return true;
};
var wait = (duration, state) => new Promise((resolve) => {
	const started = Date.now();
	const tick = () => {
		const elapsed = Date.now() - started - getPausedDuration(state);
		if (state.ended || state.stopped || elapsed >= duration) {
			resolve();
			return;
		}
		requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
});
var getPlaybackState = (state) => {
	if (state.stopped) return "stopped";
	if (state.ended) return "ended";
	if (state.paused) return "paused";
	return "playing";
};
var runInSeries = (tasks) => tasks.reduce((promise, task) => promise.then(task), Promise.resolve());
var dispatchEvent = (name, element, detail = {}) => {
	element.dispatchEvent(new CustomEvent(name, {
		bubbles: true,
		cancelable: true,
		detail
	}));
};
var selectElements = (root, selectors, notIn = []) => {
	const selector = toSelector(selectors);
	const rootMatches = globalThis.HTMLElement && root instanceof HTMLElement && root.matches(selector) && !root.closest(SKIP_SELECTOR) ? [root] : [];
	const descendants = Array.from(root.querySelectorAll(selector));
	return [...rootMatches, ...descendants].filter((element, index, elements) => elements.indexOf(element) === index && !element.closest(SKIP_SELECTOR) && !notIn.some((selector) => element.closest(selector)) && element.innerText.trim() !== "");
};
var createOutput = (document, caret) => {
	const output = document.createElement("span");
	output.classList.add("dactylo__output");
	output.dataset.dactyloOutput = "";
	output.dataset.dactyloCaret = caret;
	return output;
};
var prepareElement = (element) => {
	const original = element.ownerDocument.createElement("span");
	const originalHtml = element.innerHTML;
	const id = ++nextPreparedId;
	element.classList.add("dactylo--typing");
	original.classList.add("dactylo__original");
	original.dataset.dactyloOriginal = "";
	original.innerHTML = originalHtml;
	element.replaceChildren(original);
	activeElements.set(element, {
		id,
		originalHtml
	});
	return {
		element,
		id,
		original,
		originalHtml
	};
};
var restoreElement = ({ element, id, originalHtml }) => {
	const active = activeElements.get(element);
	if (!active || active.id !== id) return;
	element.innerHTML = originalHtml;
	element.classList.remove("dactylo--typing", "dactylo--caret");
	activeElements.delete(element);
};
var resetElementToStart = ({ element, id, original, originalHtml }) => {
	const currentOriginal = element.querySelector("[data-dactylo-original]") ?? original;
	currentOriginal.innerHTML = originalHtml;
	element.replaceChildren(currentOriginal);
	element.classList.add("dactylo--typing");
	element.classList.remove("dactylo--caret");
	activeElements.set(element, {
		id,
		originalHtml
	});
};
var step = (started, duration, chars, prepared, output, options, state) => {
	const active = activeElements.get(prepared.element);
	if (!active || active.id !== prepared.id || state.stopped) return false;
	if (state.paused) return true;
	const progress = (Date.now() - started - state.pausedDuration) / duration;
	const pointer = progress > 1 ? chars.length : Math.floor(progress * chars.length);
	output.textContent = chars.slice(0, pointer + 1).join("");
	output.append(prepared.element.ownerDocument.createElement("wbr"));
	output.classList.toggle("dactylo__output--hide-caret", !options.showFinalCaret && pointer >= chars.length - 1);
	if (pointer < chars.length) return true;
	restoreElement(prepared);
	return false;
};
var typeElement = (prepared, group, options, state) => new Promise((resolve) => {
	const chars = Array.from(prepared.element.innerText);
	const started = Date.now();
	const duration = group.interval === void 0 ? group.duration ?? DEFAULT_DURATION : chars.length * group.interval;
	const output = createOutput(prepared.element.ownerDocument, options.caret);
	if (activeElements.get(prepared.element)?.id !== prepared.id) {
		resolve();
		return;
	}
	prepared.element.append(output);
	const nextStep = () => {
		if (step(started, duration, chars, prepared, output, options, state)) {
			requestAnimationFrame(nextStep);
			return;
		}
		resolve();
	};
	requestAnimationFrame(nextStep);
});
var showPrompt = async (first, options, state) => {
	if (!first) return;
	if (activeElements.get(first.element)?.id !== first.id || state.ended || state.stopped) return;
	const prompt = createOutput(first.element.ownerDocument, options.caret);
	prompt.textContent = options.prompt;
	first.element.append(prompt);
	first.element.classList.add("dactylo--caret");
	await wait(options.startDelay, state);
	if (activeElements.get(first.element)?.id !== first.id || state.ended || state.stopped) return;
	prompt.remove();
	first.element.classList.remove("dactylo--caret");
};
var runGroup = (group, root, prepared, options, state) => {
	const tasks = selectElements(root, group.sels, group.notIn).map((element) => prepared.get(element)).filter((preparedElement) => preparedElement !== void 0).map((preparedElement) => () => typeElement(preparedElement, group, options, state));
	if (group.parallel) return Promise.all(tasks.map((task) => task()));
	return runInSeries(tasks);
};
var injectDactyloStyles = (document = globalThis.document) => {
	if (!document || document.getElementById(STYLE_ID)) return;
	const style = document.createElement("style");
	style.id = STYLE_ID;
	style.textContent = `
		@keyframes dactylo-caret-blink {
			0%,
			50% {
				opacity: 1;
			}

			70%,
			100% {
				opacity: 0;
			}
		}

		.dactylo--typing {
			position: relative;
		}

		.dactylo--typing > .dactylo__original {
			opacity: 0;
		}

		.dactylo--typing > .dactylo__output {
			box-sizing: border-box;
			display: block;
			inset-block-start: 0;
			inset-inline: 0;
			padding: inherit;
			position: absolute;
			white-space: inherit;
		}

		.dactylo--typing > .dactylo__output::after {
			content: attr(data-dactylo-caret);
			display: inline;
			font-weight: 700;
		}

		.dactylo--typing.dactylo--caret > .dactylo__output::after {
			animation: dactylo-caret-blink 1s infinite;
		}

		.dactylo--typing > .dactylo__output--hide-caret::after {
			content: "";
		}

		@media (prefers-reduced-motion: reduce) {
			.dactylo--typing > .dactylo__original {
				opacity: 1;
			}

			.dactylo--typing > .dactylo__output {
				display: none;
			}
		}
	`;
	document.head.append(style);
};
var resetDactylo = (root) => {
	const targetRoot = getRoot(root);
	if (!targetRoot) return;
	const elements = [...globalThis.HTMLElement && targetRoot instanceof HTMLElement && targetRoot.classList.contains("dactylo--typing") ? [targetRoot] : [], ...Array.from(targetRoot.querySelectorAll(".dactylo--typing"))];
	for (const element of elements) {
		const active = activeElements.get(element);
		const original = element.querySelector("[data-dactylo-original]");
		element.innerHTML = active?.originalHtml ?? original?.innerHTML ?? element.innerHTML;
		element.classList.remove("dactylo--typing", "dactylo--caret");
		activeElements.delete(element);
	}
};
var dactylo = (rootOrOptions, maybeOptions = {}) => {
	const root = rootOrOptions && "querySelectorAll" in rootOrOptions ? rootOrOptions : rootOrOptions?.root;
	const options = rootOrOptions && "querySelectorAll" in rootOrOptions ? maybeOptions : rootOrOptions ?? maybeOptions;
	const targetRoot = getRoot(root);
	const document = targetRoot ? getDocument(targetRoot) : null;
	const groups = options.groups ?? DEFAULT_GROUPS;
	const caret = options.caret ?? DEFAULT_CARET;
	const prompt = options.prompt ?? DEFAULT_PROMPT;
	const showFinalCaret = options.showFinalCaret ?? DEFAULT_SHOW_FINAL_CARET;
	const startDelay = options.startDelay ?? DEFAULT_START_DELAY;
	if (!document || !targetRoot) return {
		elements: [],
		end: () => void 0,
		finished: Promise.resolve(),
		pause: () => void 0,
		play: () => void 0,
		playPause: () => void 0,
		root: targetRoot,
		reset: () => void 0,
		state: "stopped",
		stop: () => void 0
	};
	resetDactylo(targetRoot);
	const selected = groups.flatMap((group) => selectElements(targetRoot, group.sels, group.notIn));
	const elements = [...new Set(selected)];
	const prepared = new Map(elements.map((element) => [element, prepareElement(element)]));
	const runId = ++activeRunId;
	const playback = createPlaybackState();
	let delegate = null;
	injectDactyloStyles(document);
	document.documentElement.classList.remove("dactylo--end");
	document.documentElement.classList.add("dactylo--active");
	const cancel = (eventName) => {
		if (activeRunId !== runId) return;
		activeRunId += 1;
		playback.stopped = true;
		document.documentElement.classList.remove("dactylo--active");
		document.documentElement.classList.remove("dactylo--end");
		for (const preparedElement of prepared.values()) resetElementToStart(preparedElement);
		dispatchEvent(eventName, document.documentElement, {
			controller,
			state: "stopped"
		});
	};
	const end = () => {
		if (activeRunId !== runId) return;
		activeRunId += 1;
		playback.ended = true;
		playback.paused = false;
		playback.stopped = false;
		document.documentElement.classList.remove("dactylo--active");
		document.documentElement.classList.add("dactylo--end");
		for (const preparedElement of prepared.values()) restoreElement(preparedElement);
		dispatchEvent("dactylo:end", document.documentElement, {
			controller,
			state: "ended"
		});
	};
	const controller = {
		elements,
		end: () => {
			if (delegate) {
				delegate.end();
				return;
			}
			if (playback.ended) return;
			if (playback.stopped) {
				delegate = dactylo(targetRoot, options);
				delegate.end();
				return;
			}
			end();
		},
		finished: Promise.resolve().then(() => runInSeries([() => showPrompt(prepared.values().next().value, {
			caret,
			prompt,
			startDelay
		}, playback), ...groups.map((group) => () => runGroup(group, targetRoot, prepared, {
			caret,
			showFinalCaret
		}, playback))])).then(() => {
			if (activeRunId !== runId) return;
			playback.ended = true;
			document.documentElement.classList.remove("dactylo--active");
			document.documentElement.classList.add("dactylo--end");
			dispatchEvent("dactylo:end", document.documentElement, {
				controller,
				state: "ended"
			});
		}),
		get state() {
			return delegate?.state ?? getPlaybackState(playback);
		},
		pause: () => {
			if (delegate) {
				delegate.pause();
				return;
			}
			if (pausePlayback(playback)) dispatchEvent("dactylo:pause", document.documentElement, {
				controller,
				state: getPlaybackState(playback)
			});
		},
		play: () => {
			if (delegate) {
				delegate.play();
				return;
			}
			if (playback.ended || playback.stopped) {
				delegate = dactylo(targetRoot, options);
				return;
			}
			if (playPlayback(playback)) dispatchEvent("dactylo:play", document.documentElement, {
				controller,
				state: getPlaybackState(playback)
			});
		},
		playPause: () => {
			if ((delegate?.state ?? getPlaybackState(playback)) === "playing") {
				if (delegate) {
					delegate.pause();
					return;
				}
				if (pausePlayback(playback)) dispatchEvent("dactylo:pause", document.documentElement, {
					controller,
					state: getPlaybackState(playback)
				});
				return;
			}
			if (delegate) {
				delegate.play();
				return;
			}
			if (playback.ended || playback.stopped) {
				delegate = dactylo(targetRoot, options);
				return;
			}
			if (playPlayback(playback)) dispatchEvent("dactylo:play", document.documentElement, {
				controller,
				state: getPlaybackState(playback)
			});
		},
		root: targetRoot,
		reset: () => {
			if (delegate) {
				delegate.reset();
				return;
			}
			if (playback.ended) {
				delegate = dactylo(targetRoot, options);
				delegate.reset();
				return;
			}
			cancel("dactylo:reset");
		},
		stop: () => {
			if (delegate) {
				delegate.stop();
				return;
			}
			if (playback.ended) {
				delegate = dactylo(targetRoot, options);
				delegate.stop();
				return;
			}
			pausePlayback(playback);
			cancel("dactylo:stop");
		}
	};
	dispatchEvent("dactylo:start", document.documentElement, {
		controller,
		state: "playing"
	});
	dispatchEvent("dactylo:play", document.documentElement, {
		controller,
		state: "playing"
	});
	return controller;
};
//#endregion
export { dactylo, injectDactyloStyles, resetDactylo };
