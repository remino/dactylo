import { dactylo } from './dactylo'
import { injectDactyloStyles, resetDactylo } from './dactylo'

declare global {
	interface Window {
		dactylo?: typeof dactylo
		injectDactyloStyles?: typeof injectDactyloStyles
		resetDactylo?: typeof resetDactylo
	}
}

if (typeof window !== 'undefined') {
	window.dactylo = dactylo
	window.injectDactyloStyles = injectDactyloStyles
	window.resetDactylo = resetDactylo
}

const run = (): void => {
	dactylo(document.body)
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', run, { once: true })
} else {
	run()
}

export { dactylo, injectDactyloStyles, resetDactylo } from './dactylo'
export type { DactyloController, DactyloOptions } from './dactylo'
