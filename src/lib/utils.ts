import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { AnimateTextType } from "./globalTypes";

export const animateText = (props: AnimateTextType) => {
  const {targets, type, duration, ease, delay, opacity, y, stagger} = props

  // Process all targets at once
  const allElements = targets.map(target => {
    const textSplit = new SplitText(target, {type});
    return type === "chars" ? textSplit.chars : type === "words" ? textSplit.words : textSplit.lines;
  }).flat();

  gsap.from(allElements, {
    opacity: opacity,
    y: y,
    stagger: stagger,
    duration: duration,
    ease: ease,
    delay: delay,
  });
};

// Timeline version - better performance for complex animations
export const animateTextTimeline = (props: AnimateTextType) => {
  const {targets, type, duration, ease, delay, opacity, y, stagger} = props

  const tl = gsap.timeline();

  targets.forEach((target, index) => {
    const textSplit = new SplitText(target, {type});
    const elements = type === "chars" ? textSplit.chars : type === "words" ? textSplit.words : textSplit.lines;

    
    // Animate to final state
    tl.fromTo(elements, {
        opacity: opacity,
        y: y,
       
    }, 
     {
      opacity: 1,
      y: 0,
      stagger: stagger || 0.1,
      duration: duration,
      delay: delay || 0,
      ease: ease,
    },); // Stagger between different targets
  });

  //return tl; // Return timeline for further control
};