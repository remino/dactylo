export interface DactyloGroup {
    duration?: number;
    interval?: number;
    notIn?: string[];
    parallel?: boolean;
    sels: string | string[];
}
export interface DactyloOptions {
    caret?: string;
    groups?: DactyloGroup[];
    prompt?: string;
    root?: ParentNode;
    showFinalCaret?: boolean;
    startDelay?: number;
}
export interface DactyloController {
    elements: HTMLElement[];
    finished: Promise<void>;
    root: ParentNode | null;
    reset: () => void;
}
export declare const injectDactyloStyles: (document?: Document) => void;
export declare const resetDactylo: (root?: ParentNode) => void;
export declare const dactylo: (rootOrOptions?: ParentNode | DactyloOptions, maybeOptions?: DactyloOptions) => DactyloController;
