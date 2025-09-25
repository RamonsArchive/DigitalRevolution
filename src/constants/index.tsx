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
    missionTitle: "Mission",
    descriptionTitle: "Further Information",
    howToSupportTitle: "How to Support",
    missionStatement:
      "Democracy and egalitarin values cannot be acheived and mantined if countires or coummnites are mere spectators and renters of the digital world",
    aboutDescription:
      "Digitial Revolution was founded in 2025 by Ramon McDargh-Mitchell to help spread awarneses and support the underprivleged communites who are left behind in the digital age. The foundation dontates 50% of its profits to causes that help address the digital divide.",
    missionDescription:
      "The purpose of our mission is to help protect and spread egalitarin democratic values that cannot be acheived and mantined if countires or coummnites are left out of the digital age. Ones access to the widepsread thoughs of the internet, ownership of thier own data infustructure and ability to particpate in the digial world by thier own rules, protections, and without the limtitations of foreign managers who's intrests often create renters out of digital infusturcture which are oppressive by virtue of the lack of egalitarin rights.",
    howToSupport:
      "There are many ways to support our mission, including shopping our newly relased products in our store, donating to our cause, or simply sharing our mission with others",
  },
  logo: {
    src: "/Assets/Logos/lightDRLogo.svg",
    alt: "Digital Revolution Logo",
  },
  images: [
    {
      src: "/Assets/About/Images/personal1.png",
      alt: "Digital Revolution Image 1",
      description: "Founder!",
    },
    {
      src: "/Assets/About/Images/personal2.png",
      alt: "Digital Revolution Image 2",
      description:
        "Founder rocking the founders edition t-shirt found in the store",
    },
  ],
};
