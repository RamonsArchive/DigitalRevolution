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
    description: [
      <>
        Over{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          two billion people
        </span>{" "}
        do not have access to{" "}
        <span className="underline decoration-secondary-500 decoration-2 underline-offset-4 text-secondary-500">
          reliable data connectivity
        </span>
      </>,
      <>
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
      </>,
      <>
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
      </>,
    ],

    sources: [
      "https://www.weforum.org/stories/2025/01/technological-advancements-and-human-development/",
      "https://tcf.org/content/report/disconnected-digital-divide-harms-workers-can/",
    ],
  },
};
