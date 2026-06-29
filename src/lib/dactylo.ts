const STYLE_ID = 'dactylo-style'
const SKIP_SELECTOR =
	'script,style,noscript,template,textarea,input,select,option,[data-dactylo-skip],[data-dactylo-original],[data-dactylo-output]'
const DEFAULT_GROUPS: DactyloGroup[] = [
	{
		sels: 'h1,h2,h3,h4,h5,h6',
		duration: 600,
		parallel: true,
	},
	{
		sels: 'p,li,dt,dd,figcaption,blockquote,pre,th,td,caption',
		parallel: true,
	},
	{
		sels: 'code,a,button,label,summary,mark',
		parallel: true,
	},
]
const DEFAULT_CARET = '_'
const DEFAULT_PROMPT = '>'
const DEFAULT_START_DELAY = 600
const DEFAULT_DURATION = 500

export interface DactyloGroup {
	duration?: number
	interval?: number
	notIn?: string[]
	parallel?: boolean
	sels: string | string[]
}

export interface DactyloOptions {
	caret?: string
	groups?: DactyloGroup[]
	prompt?: string
	root?: ParentNode
	startDelay?: number
}

export interface DactyloController {
	elements: HTMLElement[]
	finished: Promise<void>
	root: ParentNode | null
	reset: () => void
}

interface PreparedElement {
	element: HTMLElement
	original: HTMLElement
	originalHtml: string
}

const getRoot = (root?: ParentNode): ParentNode | null =>
	root ?? globalThis.document?.body ?? null

const getDocument = (root: ParentNode): Document | null => {
	if ('ownerDocument' in root && root.ownerDocument) return root.ownerDocument
	if ('nodeType' in root && root.nodeType === root.DOCUMENT_NODE) {
		return root as Document
	}

	return globalThis.document ?? null
}

const toSelector = (selectors: string | string[]): string =>
	Array.isArray(selectors) ? selectors.join(',') : selectors

const wait = (duration: number): Promise<void> =>
	new Promise(resolve => setTimeout(resolve, duration))

const runInSeries = (tasks: Array<() => Promise<unknown>>): Promise<void> =>
	tasks.reduce<Promise<unknown>>(
		(promise, task) => promise.then(task),
		Promise.resolve()
	) as Promise<void>

const dispatchEvent = (name: string, element: Element): void => {
	element.dispatchEvent(
		new CustomEvent(name, { bubbles: true, cancelable: true })
	)
}

const selectElements = (
	root: ParentNode,
	selectors: string | string[],
	notIn: string[] = []
): HTMLElement[] => {
	const selector = toSelector(selectors)
	const rootMatches =
		globalThis.HTMLElement &&
		root instanceof HTMLElement &&
		root.matches(selector) &&
		!root.closest(SKIP_SELECTOR)
			? [root]
			: []
	const descendants = Array.from(root.querySelectorAll<HTMLElement>(selector))

	return [...rootMatches, ...descendants].filter(
		(element, index, elements) =>
			elements.indexOf(element) === index &&
			!element.closest(SKIP_SELECTOR) &&
			!notIn.some(selector => element.closest(selector)) &&
			element.innerText.trim() !== ''
	)
}

const createOutput = (document: Document, caret: string): HTMLElement => {
	const output = document.createElement('span')

	output.classList.add('dactylo__output')
	output.dataset.dactyloOutput = ''
	output.dataset.dactyloCaret = caret

	return output
}

const prepareElement = (element: HTMLElement): PreparedElement => {
	const document = element.ownerDocument
	const original = document.createElement('span')
	const originalHtml = element.innerHTML

	element.classList.add('dactylo--typing')
	original.classList.add('dactylo__original')
	original.dataset.dactyloOriginal = ''
	original.innerHTML = originalHtml
	element.replaceChildren(original)

	return { element, original, originalHtml }
}

const restoreElement = ({ element, originalHtml }: PreparedElement): void => {
	element.innerHTML = originalHtml
	element.classList.remove('dactylo--typing', 'dactylo--caret')
}

const step = (
	started: number,
	duration: number,
	chars: string[],
	prepared: PreparedElement,
	output: HTMLElement
): boolean => {
	const elapsed = Date.now() - started
	const progress = elapsed / duration
	const pointer =
		progress > 1 ? chars.length : Math.floor(progress * chars.length)

	output.textContent = chars.slice(0, pointer + 1).join('')
	output.append(prepared.element.ownerDocument.createElement('wbr'))

	if (pointer < chars.length) return true

	restoreElement(prepared)
	return false
}

const typeElement = (
	prepared: PreparedElement,
	group: DactyloGroup,
	options: Required<Pick<DactyloOptions, 'caret'>>
): Promise<void> =>
	new Promise(resolve => {
		const chars = Array.from(prepared.element.innerText)
		const started = Date.now()
		const duration =
			group.interval === undefined
				? (group.duration ?? DEFAULT_DURATION)
				: chars.length * group.interval
		const output = createOutput(prepared.element.ownerDocument, options.caret)

		prepared.element.append(output)

		const nextStep = (): void => {
			if (step(started, duration, chars, prepared, output)) {
				requestAnimationFrame(nextStep)
				return
			}

			resolve()
		}

		requestAnimationFrame(nextStep)
	})

const showPrompt = async (
	first: PreparedElement | undefined,
	options: Required<Pick<DactyloOptions, 'caret' | 'prompt' | 'startDelay'>>
): Promise<void> => {
	if (!first) return

	const prompt = createOutput(first.element.ownerDocument, options.caret)

	prompt.textContent = options.prompt
	first.element.append(prompt)
	first.element.classList.add('dactylo--caret')

	await wait(options.startDelay)

	prompt.remove()
	first.element.classList.remove('dactylo--caret')
}

const runGroup = (
	group: DactyloGroup,
	root: ParentNode,
	prepared: Map<HTMLElement, PreparedElement>,
	options: Required<Pick<DactyloOptions, 'caret'>>
): Promise<unknown> => {
	const tasks = selectElements(root, group.sels, group.notIn)
		.map(element => prepared.get(element))
		.filter(preparedElement => preparedElement !== undefined)
		.map(preparedElement => () => typeElement(preparedElement, group, options))

	if (group.parallel) return Promise.all(tasks.map(task => task()))
	return runInSeries(tasks)
}

export const injectDactyloStyles = (document = globalThis.document): void => {
	if (!document || document.getElementById(STYLE_ID)) return

	const style = document.createElement('style')
	style.id = STYLE_ID
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
			display: inline;
			inset-block-start: 0;
			inset-inline: 0;
			position: absolute;
		}

		.dactylo--typing > .dactylo__output::after {
			content: attr(data-dactylo-caret);
			display: inline;
			font-weight: 700;
		}

		.dactylo--typing.dactylo--caret > .dactylo__output::after {
			animation: dactylo-caret-blink 1s infinite;
		}

		@media (prefers-reduced-motion: reduce) {
			.dactylo--typing > .dactylo__original {
				opacity: 1;
			}

			.dactylo--typing > .dactylo__output {
				display: none;
			}
		}
	`
	document.head.append(style)
}

export const resetDactylo = (root?: ParentNode): void => {
	const targetRoot = getRoot(root)
	if (!targetRoot) return

	for (const element of Array.from(
		targetRoot.querySelectorAll<HTMLElement>('.dactylo--typing')
	)) {
		const original = element.querySelector<HTMLElement>(
			'[data-dactylo-original]'
		)
		element.innerHTML = original?.innerHTML ?? element.innerHTML
		element.classList.remove('dactylo--typing', 'dactylo--caret')
	}
}

export const dactylo = (
	rootOrOptions?: ParentNode | DactyloOptions,
	maybeOptions: DactyloOptions = {}
): DactyloController => {
	const root =
		rootOrOptions && 'querySelectorAll' in rootOrOptions
			? rootOrOptions
			: (rootOrOptions as DactyloOptions | undefined)?.root
	const options =
		rootOrOptions && 'querySelectorAll' in rootOrOptions
			? maybeOptions
			: ((rootOrOptions as DactyloOptions | undefined) ?? maybeOptions)
	const targetRoot = getRoot(root)
	const document = targetRoot ? getDocument(targetRoot) : null
	const groups = options.groups ?? DEFAULT_GROUPS
	const caret = options.caret ?? DEFAULT_CARET
	const prompt = options.prompt ?? DEFAULT_PROMPT
	const startDelay = options.startDelay ?? DEFAULT_START_DELAY
	const selected = targetRoot
		? groups.flatMap(group =>
				selectElements(targetRoot, group.sels, group.notIn)
			)
		: []
	const elements = [...new Set(selected)]
	const prepared = new Map(
		elements.map(element => [element, prepareElement(element)])
	)

	if (!document || !targetRoot) {
		return {
			elements: [],
			finished: Promise.resolve(),
			root: targetRoot,
			reset: () => undefined,
		}
	}

	injectDactyloStyles(document)
	document.documentElement.classList.remove('dactylo--end')
	document.documentElement.classList.add('dactylo--active')
	dispatchEvent('dactylo:start', document.documentElement)

	const finished = runInSeries([
		() =>
			showPrompt(prepared.values().next().value, { caret, prompt, startDelay }),
		...groups.map(
			group => () => runGroup(group, targetRoot, prepared, { caret })
		),
	]).then(() => {
		document.documentElement.classList.remove('dactylo--active')
		document.documentElement.classList.add('dactylo--end')
		dispatchEvent('dactylo:end', document.documentElement)
	})

	return {
		elements,
		finished,
		root: targetRoot,
		reset: () => resetDactylo(targetRoot),
	}
}
