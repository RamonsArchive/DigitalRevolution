import React from "react";

export const NAV_LINKS = [
  {
    id: "home",
    href: "/",
    label: "Home",
  },
  {
    id: "about",
    href: "/about",
    label: "About",
  },
  {
    id: "shop",
    href: "/shop",
    label: "Shop",
  },
  {
    id: "partners",
    href: "/partners",
    label: "Partners",
  },
  {
    id: "donate",
    href: "/donate",
    label: "Donate",
  },
  {
    id: "share",
    href: "/share",
    label: "Share",
  },
];

export const HOME_TEXT_SECTIONS = {
  section1: {
    id: "section-1",
    title: <>We're on a mission to make tech accessible to all </>,
    description: (
      <>
        We're a non-profit foundation that advocates on the behalf of the{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          underprivileged
        </span>{" "}
        who's lack of{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          technology access
        </span>{" "}
        and{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          infrastructure
        </span>{" "}
        is a barrier to their success and a threat to{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          democratic free society values
        </span>
      </>
    ),
  },

  section2: {
    id: "section-2",
    title: <>Here are the facts!</>,
    description: [
      <React.Fragment key="fact-1">
        Over{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          two billion people
        </span>{" "}
        do not have access to{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          reliable data connectivity
        </span>
      </React.Fragment>,
      <React.Fragment key="fact-2">
        The{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          internet penetration rate
        </span>{" "}
        in sub-Saharan Africa stands at just{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          39%
        </span>{" "}
        compared to nearly{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          93% in Europe
        </span>
      </React.Fragment>,
      <React.Fragment key="fact-3">
        Many have linked the{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          digital divide
        </span>{" "}
        to poor{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          economic and social outcomes
        </span>
        , such as fewer job opportunities, less competitive economies, or lower
        student performance, showing how it{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          exacerbates existing inequalities
        </span>{" "}
        along racial and other social lines.
      </React.Fragment>,
    ],

    sources: [
      {
        title: "Technological Advancements and Human Development",
        href: "https://www.weforum.org/stories/2025/01/technological-advancements-and-human-development/",
      },
      {
        title: "Disconnected Digital Divide Harms Workers Can",
        href: "https://tcf.org/content/report/disconnected-digital-divide-harms-workers-can/",
      },
    ],
  },

  section3: {
    id: "section-3",
    title: <>How you can support</>,
    description: [
      {
        href: "/shop",
        label: "Shop our store",
      },
      {
        href: "/donate",
        label: "Donate to our cause",
      },
      {
        href: "/share",
        label: "Share our mission",
      },
      {
        href: "/partners",
        label: "Partner with us",
      },
    ],
  },
};

export const SHOP_DATA = {
  shopNavLinks: [
    {
      id: "all",
      label: "All",
      value: "", // Empty string means no category filter
    },
    {
      id: "men",
      label: "Men",
      value: "men", // Use this for filtering
    },
    {
      id: "women",
      label: "Women",
      value: "women",
    },
    {
      id: "unisex",
      label: "Unisex",
      value: "unisex",
    },
    {
      id: "kids",
      label: "Kids",
      value: "kids",
    },
  ],
};

export const quickSearches = [
  {
    label: "Founder's",
    value: "founder's",
  },
  {
    label: "Xen",
    value: "xen",
  },
  {
    label: "Hoodie",
    value: "hoodie",
  },
  {
    label: "Pullover",
    value: "pullover",
  },
  {
    label: "Sweatpants",
    value: "sweatpants",
  },
  {
    label: "Dark",
    value: "dark",
  },
  {
    label: "Light",
    value: "light",
  },
];

export const ABOUT_DATA = {
  id: "about",
  text: {
    mainTitle: "About",
    missionTitle: "Mission Statement",
    descriptionTitle: "Mission Continued...",
    howToSupportTitle: "How to Support",
    founderTitle: "Our Founder",

    missionStatement:
      "Democracy and egalitarian values cannot be achieved and maintained if countries or communities are mere spectators and renters of the digital world.",

    aboutDescription:
      "Digital Revolution was founded in 2025 by Ramon McDargh-Mitchell to help spread awareness and support underprivileged communities who are left behind in the digital age. The foundation donates 50% of its profits to causes that help address the digital divide.",

    missionDescription:
      "Our mission is to protect and promote egalitarian democratic values that cannot be achieved or maintained when countries or communities are excluded from the digital age. We believe in universal access to the widespread knowledge of the internet, community ownership of data infrastructure, and the ability to participate in the digital world under self-determined rules and protections. We oppose systems that create digital renters rather than owners, which are inherently oppressive due to their lack of egalitarian rights and dependence on foreign managers whose interests may not align with local communities.",

    founderDescription:
      "Ramon McDargh-Mitchell is a technology advocate and digital rights activist with a background in software development and community organizing. Having witnessed firsthand the growing digital divide in underserved communities, Ramon founded Digital Revolution to bridge the gap between technological advancement and equitable access. Through this foundation, Ramon aims to ensure that technological progress serves humanity's democratic ideals rather than concentrating power in the hands of a few.",

    howToSupport:
      "There are many ways to support our mission: shop our newly released products in our store (with 50% of profits going directly to digital equity initiatives), make a direct donation to our cause, volunteer with partner organizations working on digital literacy, or simply share our mission with others in your community.",
  },

  logo: {
    src: "/Assets/Logos/lightDRLogo.svg",
    alt: "Digital Revolution Logo",
  },

  images: [
    {
      src: "/Assets/About/personal1.png",
      alt: "Ramon McDargh-Mitchell, Founder of Digital Revolution",
      description: "Founder and Digital Rights Advocate",
    },
    {
      src: "/Assets/About/personal5.png",
      alt: "Ramon wearing Digital Revolution founder's edition t-shirt",
      description:
        "Ramon sporting the founder's edition t-shirt available in our store",
    },
  ],

  // Additional suggested sections:
  values: [
    {
      title: "Digital Equity",
      description:
        "Everyone deserves equal access to digital tools and opportunities",
    },
    {
      title: "Community Ownership",
      description:
        "Local communities should control their digital infrastructure",
    },
    {
      title: "Transparent Impact",
      description: "50% of profits directly fund digital divide initiatives",
    },
    {
      title: "Democratic Values",
      description:
        "Technology should strengthen, not weaken, democratic participation",
    },
  ],

  stats: {
    founded: "2025",
    profitsDonated: "50%",
    communitiesServed: "Growing daily", // You can update this with actual numbers
    missionFocus: "Digital equity and democratic access",
  },
};
