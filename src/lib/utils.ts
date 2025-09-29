import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { AnimateCardScrollType, AnimateTextScrollType, AnimateTextType, PrintfulProduct } from "./globalTypes";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type DOMTarget = string | Element | null;


gsap.registerPlugin(ScrollTrigger, SplitText);

export const parseServerActionResponse = <T>(response: T): T => {
  return JSON.parse(JSON.stringify(response));
}

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

export const animateTextScroll = (props: AnimateTextScrollType) => {
  const {targets, shouldAnimateClass, animateClass, type, duration, ease, delay, opacity, y, stagger} = props
  const {trigger, start, end, scrub} = props.scrollTrigger;

  const tl = gsap.timeline();

  targets.forEach((target, index) => {
    const textSplit = new SplitText(target as unknown as HTMLElement | string, {type});
    const elements = type === "chars" ? textSplit.chars : type === "words" ? textSplit.words : textSplit.lines;

    // Set initial state
    gsap.set(elements, {
      opacity: opacity,
      y: y,
    });

    // Apply gradient text class to split elements
    if (shouldAnimateClass) {
      elements.forEach((element) => {
          element.classList.add(animateClass);
        });
    }

    // Animate to final state with ScrollTrigger
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      stagger: stagger || 0.1,
      duration: duration,
      delay: delay || 0,
      ease: ease,
      scrollTrigger: {
        trigger: target as unknown as DOMTarget,
        start: start,
        end: end,
        scrub: scrub,
        markers: true, // Remove markers for production
      },
    });
  });

  return tl;
}


export const animateCardsScroll = (props: AnimateCardScrollType) => {
  const {targets, duration, ease, delay, opacity, y, stagger} = props
  const {trigger, start, end, scrub} = props.scrollTrigger;

  const tl = gsap.timeline();

  targets.forEach((target, index) => {
    const allElmenets = document.querySelectorAll(target);
    tl.fromTo(allElmenets, {
      opacity: opacity,
      y: y,
    }, {
      opacity: 1,
      y: 0,
      stagger: stagger || 0.1,
      duration: duration,
      delay: delay || 0,
      ease: ease,
      scrollTrigger: {
        trigger: target,
        start: start,
        end: end,
        scrub: scrub,
        markers: true,
      },
    })
  })
}


export const extractGenderFromProduct = (product: PrintfulProduct): string => {
  // Get the base product name from any variant
  const baseProductName = product.sync_product.name || "";
  const gender = baseProductName.split("-").pop()?.trim().toLowerCase() || "";
  console.log("gender", gender);
  console.log([...gender].map(c => c.charCodeAt(0)));
  
  // Map Printful's gender terms to your navigation categories
  const genderMap: Record<string, string> = {
    'unisex': 'unisex',
    'men': 'men',
    'mens': 'men',
    "men's": 'men',
    'women': 'women',
    'womens': 'women',
    "women's": 'women',
    'kids': 'kids',
    'youth': 'kids',
    'child': 'kids'
  };
  
  return genderMap[gender] || 'unisex';
};

export const getProductBySlug = (slug: string, allProducts: PrintfulProduct[]) => {
  try {
    return allProducts.find((product) => product.sync_product.external_id === slug);
  } catch (error) {
    console.error(`Error getting product by slug ${slug}:`, error);
    throw new Error(`Error getting product by slug ${slug}: ${error}`);
  }
};

// Utility function to aggregate product images from variants
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const aggregateProductImages = (product: any) => {
  const images: Array<{
    url: string;
    variantId: number;
    color: string;
    size: string;
  }> = [];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product.sync_variants.forEach((variant: any) => {
    // Get the preview image from files array (index 1 as mentioned)
    const previewFile = variant.files?.[1];
    if (previewFile?.preview_url) {
      images.push({
        url: previewFile.preview_url,
        variantId: variant.id,
        color: variant.color,
        size: variant.size,
      });
    }
  });

  // Remove duplicates based on URL
  const uniqueImages = images.filter((image, index, self) => 
    index === self.findIndex(img => img.url === image.url)
  );

  return uniqueImages;
};


// Phone number formatting
export const updatePhoneNumber = (value: string, phoneNumber: string, setPhoneNumber: (value: string) => void) => {
  // If the user is backspacing and hit a dash, remove the digit before the dash
  const prevLength = phoneNumber.length;
  const newLength = value.length;

  // Check if user is backspacing on a dash
  if (newLength < prevLength) {
    const deletedChar = phoneNumber[newLength];
    if (deletedChar === "-") {
      // Remove the digit before the dash as well
      const withoutDash = phoneNumber.slice(0, newLength);
      const withoutLastDigit = withoutDash.slice(0, -1);
      setPhoneNumber(withoutLastDigit);
      return;
    }
  }

  // Normal processing
  const cleanedValue = value.replace(/[^0-9]/g, "");

  if (cleanedValue.length > 10) {
    return;
  }

  // Format the number
  let formattedValue = cleanedValue;
  if (cleanedValue.length >= 6) {
    formattedValue = `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(
      3,
      6
    )}-${cleanedValue.slice(6, 10)}`;
  } else if (cleanedValue.length >= 3) {
    formattedValue = `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3)}`;
  }

  setPhoneNumber(formattedValue);
};

export const formToDataObject = (formData: FormData) => {
  const formObject: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    formObject[key] = value.toString();
  }
  return formObject;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'Not available';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}
