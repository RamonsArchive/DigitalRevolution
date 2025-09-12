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
    id: "contact",
    href: "/contact",
    label: "Contact",
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
    description: (
      <>
        <ul>
          <li>
            Over two billion people do not have access to reliable data
            connectivity
          </li>
          <li>
            The internet penetration rate in sub-Saharan Africa stands at just
            39% compared to nearly 93% in Europe
          </li>
          <li>
            Many have linked the digital divide to poor economic and social
            outcomes, such as fewer job opportunities, less competitive
            economies, or lower student performance, showing how it exacerbates
            existing inequalities along racial and other social lines.
          </li>
        </ul>
      </>
    ),
    sources: [
      "https://www.weforum.org/stories/2025/01/technological-advancements-and-human-development/",
      "https://tcf.org/content/report/disconnected-digital-divide-harms-workers-can/",
    ],
  },
};
