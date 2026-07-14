/*! dactylo v0.1.0 | (c) 2026 Rémino Rem <https://remino.net/> | ISC Licence */
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
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
var wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
var runInSeries = (tasks) => tasks.reduce((promise, task) => promise.then(task), Promise.resolve());
var dispatchEvent = (name, element) => {
	element.dispatchEvent(new CustomEvent(name, {
		bubbles: true,
		cancelable: true
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
var step = (started, duration, chars, prepared, output, options) => {
	const active = activeElements.get(prepared.element);
	if (!active || active.id !== prepared.id) return false;
	const progress = (Date.now() - started) / duration;
	const pointer = progress > 1 ? chars.length : Math.floor(progress * chars.length);
	output.textContent = chars.slice(0, pointer + 1).join("");
	output.append(prepared.element.ownerDocument.createElement("wbr"));
	output.classList.toggle("dactylo__output--hide-caret", !options.showFinalCaret && pointer >= chars.length - 1);
	if (pointer < chars.length) return true;
	restoreElement(prepared);
	return false;
};
var typeElement = (prepared, group, options) => new Promise((resolve) => {
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
		if (step(started, duration, chars, prepared, output, options)) {
			requestAnimationFrame(nextStep);
			return;
		}
		resolve();
	};
	requestAnimationFrame(nextStep);
});
var showPrompt = async (first, options) => {
	if (!first) return;
	const prompt = createOutput(first.element.ownerDocument, options.caret);
	prompt.textContent = options.prompt;
	first.element.append(prompt);
	first.element.classList.add("dactylo--caret");
	await wait(options.startDelay);
	if (activeElements.get(first.element)?.id !== first.id) return;
	prompt.remove();
	first.element.classList.remove("dactylo--caret");
};
var runGroup = (group, root, prepared, options) => {
	const tasks = selectElements(root, group.sels, group.notIn).map((element) => prepared.get(element)).filter((preparedElement) => preparedElement !== void 0).map((preparedElement) => () => typeElement(preparedElement, group, options));
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
		finished: Promise.resolve(),
		root: targetRoot,
		reset: () => void 0
	};
	resetDactylo(targetRoot);
	const selected = groups.flatMap((group) => selectElements(targetRoot, group.sels, group.notIn));
	const elements = [...new Set(selected)];
	const prepared = new Map(elements.map((element) => [element, prepareElement(element)]));
	const runId = ++activeRunId;
	injectDactyloStyles(document);
	document.documentElement.classList.remove("dactylo--end");
	document.documentElement.classList.add("dactylo--active");
	dispatchEvent("dactylo:start", document.documentElement);
	return {
		elements,
		finished: runInSeries([() => showPrompt(prepared.values().next().value, {
			caret,
			prompt,
			startDelay
		}), ...groups.map((group) => () => runGroup(group, targetRoot, prepared, {
			caret,
			showFinalCaret
		}))]).then(() => {
			if (activeRunId !== runId) return;
			document.documentElement.classList.remove("dactylo--active");
			document.documentElement.classList.add("dactylo--end");
			dispatchEvent("dactylo:end", document.documentElement);
		}),
		root: targetRoot,
		reset: () => {
			if (activeRunId === runId) activeRunId += 1;
			resetDactylo(targetRoot);
		}
	};
};
//#endregion
exports.dactylo = dactylo;
exports.injectDactyloStyles = injectDactyloStyles;
exports.resetDactylo = resetDactylo;
