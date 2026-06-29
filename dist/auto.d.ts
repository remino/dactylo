import { dactylo } from './dactylo';
import { injectDactyloStyles, resetDactylo } from './dactylo';
declare global {
    interface Window {
        dactylo?: typeof dactylo;
        injectDactyloStyles?: typeof injectDactyloStyles;
        resetDactylo?: typeof resetDactylo;
    }
}
export { dactylo, injectDactyloStyles, resetDactylo } from './dactylo';
export type { DactyloController, DactyloOptions } from './dactylo';
