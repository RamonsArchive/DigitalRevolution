
export type AnimateTextType = {
    targets: string[];
    type: "chars" | "words";
    duration: number;
    ease: string;
    delay?: number;
    opacity: number;
    y: number;
    stagger?: number;
}