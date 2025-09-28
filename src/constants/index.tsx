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
    impactTitle: "Our Impact Areas",

    missionStatement:
      "Democracy and egalitarian values cannot be achieved and maintained if countries or communities are mere spectators and renters of the digital world.",

    aboutDescription:
      "Digital Revolution was founded in 2025 by Ramon McDargh-Mitchell to help spread awareness and support underprivileged communities who are left behind in the digital age, and thus have fewer opportunities to succeed in education, careers, and civic participation. The foundation donates 50% of its profits to causes that help address the digital divide and expand access to STEM education opportunities.",

    missionDescription:
      "Our mission is to protect and promote egalitarian democratic values that cannot be achieved or maintained when countries or communities are excluded from the digital age. We believe in universal access to the widespread knowledge of the internet, community ownership of data infrastructure, and the ability to participate in the digital world under self-determined rules and protections. We oppose systems that create digital renters rather than owners, which are inherently oppressive due to their lack of egalitarian rights and dependence on foreign managers whose interests may not align with local communities. By bridging the digital divide, we also create pathways for individuals to access STEM education, coding bootcamps, online learning platforms, and technology careers that were previously out of reach.",

    founderDescription:
      "Ramon McDargh-Mitchell is a technology advocate and digital rights activist with a background in software development, computer science education, and community organizing. With experience in both industry and academia, Ramon has seen how digital inequality creates barriers not just to information access, but to STEM career opportunities and educational advancement. Having witnessed firsthand the growing digital divide in underserved communities, Ramon founded Digital Revolution to bridge the gap between technological advancement and equitable access. Through this foundation, Ramon aims to ensure that technological progress serves humanity's democratic ideals while creating pathways for individuals to pursue careers in science, technology, engineering, and mathematics.",

    howToSupport:
      "There are many ways to support our mission: shop our newly released products in our store (with 50% of profits going directly to digital equity and STEM education initiatives), make a direct donation to our cause, volunteer with partner organizations working on digital literacy and coding education, mentor individuals pursuing STEM careers, or simply share our mission with others in your community.",
  },

  impactAreas: [
    {
      title: "Digital Infrastructure Access",
      description:
        "Ensuring communities have reliable internet connectivity and modern computing resources",
      stemConnection:
        "Foundation for accessing online STEM courses, research databases, and coding platforms",
    },
    {
      title: "Digital Literacy Programs",
      description:
        "Teaching essential computer skills and internet safety to underserved populations",
      stemConnection:
        "Building prerequisite skills for STEM education and technology career pathways",
    },
    {
      title: "STEM Education Pathways",
      description:
        "Creating bridges to science, technology, engineering, and mathematics opportunities",
      stemConnection:
        "Coding bootcamps, online engineering courses, data science workshops, and tech mentorship",
    },
    {
      title: "Community Data Sovereignty",
      description:
        "Empowering local communities to own and control their digital infrastructure",
      stemConnection:
        "Training local technicians, network administrators, and cybersecurity professionals",
    },
  ],

  logo: {
    src: "/Logos/lightDRLogo.svg",
    alt: "Digital Revolution Logo",
  },

  images: [
    {
      src: "/About/personal1.png",
      alt: "Ramon McDargh-Mitchell, Founder of Digital Revolution",
      description:
        "Founder, Digital Rights Advocate, and STEM Education Champion",
    },
    {
      src: "/About/personal5.png",
      alt: "Ramon wearing Digital Revolution founder's edition t-shirt",
      description:
        "Ramon sporting the founder's edition t-shirt available in our store",
    },
  ],

  values: [
    {
      title: "Digital Equity",
      description:
        "Everyone deserves equal access to digital tools, opportunities, and STEM education pathways",
    },
    {
      title: "Community Ownership",
      description:
        "Local communities should control their digital infrastructure and technology education programs",
    },
    {
      title: "Transparent Impact",
      description:
        "50% of profits directly fund digital divide and STEM accessibility initiatives",
    },
    {
      title: "Democratic Values",
      description:
        "Technology should strengthen democratic participation and create inclusive pathways to STEM careers",
    },
    {
      title: "Educational Opportunity",
      description:
        "Digital access should unlock doors to science, technology, engineering, and mathematics for all",
    },
  ],

  stats: {
    founded: "2025",
    profitsDonated: "50%",
    communitiesServed: "Growing daily",
    missionFocus:
      "Digital equity, democratic access, and STEM opportunity expansion",
    educationFocus: "Bridging digital divides to unlock STEM potential",
  },

  initiatives: [
    {
      name: "Digital Democracy Project",
      description:
        "Ensuring communities can participate fully in digital civic life",
    },
    {
      name: "STEM Bridge Program",
      description:
        "Creating pathways from digital literacy to technology careers",
    },
    {
      name: "Community Tech Hubs",
      description:
        "Establishing local centers for digital learning and STEM education",
    },
    {
      name: "Open Source Education",
      description:
        "Developing freely accessible STEM curricula and coding resources",
    },
  ],

  partnerships: {
    educational: "Universities, community colleges, and coding bootcamps",
    corporate:
      "Technology companies providing resources and internship opportunities",
    nonprofit:
      "Organizations focused on educational equity and community development",
    government:
      "Agencies working on digital inclusion and workforce development",
  },
};

export const PARTNERS_DATA = {
  id: "partners",
  text: {
    mainTitle: "Partners",
    subTitle: "Partner with us",
    appreciationTitle: "Our Appreciation",
    formTitle: "Submit a Partnership Request",
    typesTitle: "Partnership Types",
    benefitsTitle: "Partnership Benefits",

    subdescription:
      "Partner with us to help make a meaningful difference in bridging the digital divide that plagues our communities. Together, we can create lasting change and ensure digital equity for all.",

    appreciationDescription:
      "We are deeply grateful to our partners for their unwavering support and invaluable contributions to our mission. Their collaboration, resources, and shared vision enable us to expand our reach and amplify our impact. Without these dedicated partnerships, achieving our mission of digital equity would not be possible.",

    partnershipOverview:
      "Digital Revolution partners with organizations, businesses, educational institutions, and community groups that share our commitment to closing the digital divide. We believe that collaborative efforts create exponentially greater impact than working in isolation.",

    callToAction:
      "Ready to join forces with us? Whether you're a nonprofit organization, educational institution, technology company, or community group, we'd love to explore how we can work together to advance digital equity.",
  },

  partnershipTypes: [
    {
      type: "Corporate Partners",
      description:
        "Technology companies and businesses that provide resources, funding, or in-kind donations",
      examples: "Hardware donations, software licenses, funding for programs",
    },
    {
      type: "Educational Institutions",
      description:
        "Schools, universities, and training centers that help deliver digital literacy programs",
      examples: "Curriculum development, training venues, student volunteers",
    },
    {
      type: "Nonprofit Organizations",
      description:
        "Community organizations that share our mission and can help reach underserved populations",
      examples: "Program delivery, community outreach, resource sharing",
    },
    {
      type: "Government Agencies",
      description:
        "Local and federal agencies working on digital inclusion initiatives",
      examples: "Policy advocacy, funding opportunities, program coordination",
    },
  ],

  benefits: [
    {
      title: "Shared Impact",
      description:
        "Amplify your organization's social impact through collaborative digital equity initiatives",
    },
    {
      title: "Community Recognition",
      description:
        "Gain recognition as a leader in addressing the digital divide in your community",
    },
    {
      title: "Networking Opportunities",
      description:
        "Connect with like-minded organizations and expand your professional network",
    },
    {
      title: "Resource Sharing",
      description:
        "Access shared resources, knowledge, and best practices from our partner network",
    },
    {
      title: "Transparent Reporting",
      description:
        "Receive detailed impact reports showing how your partnership creates measurable change",
    },
  ],

  requirements: {
    title: "Partnership Requirements",
    description: "We seek partners who:",
    criteria: [
      "Share our commitment to digital equity and democratic values",
      "Demonstrate integrity and transparency in their operations",
      "Have the capacity to contribute meaningfully to our mission",
      "Are willing to collaborate and communicate regularly",
      "Align with our goal of sustainable, community-driven solutions",
    ],
  },

  images: [
    {
      src: "/Partners/partners2.jpg",
      alt: "Educational Institution Partnership",
      description: "University collaboration on digital literacy programs",
    },
    {
      src: "/Partners/partners3.jpg",
      alt: "Community Organization Partnership",
      description: "Nonprofit partnership delivering technology training",
    },
    {
      src: "/Partners/partners1.jpg",
      alt: "Digital Revolution Corporate Partner",
      description: "Corporate partnership supporting community digital access",
    },
  ],

  stats: {
    currentPartners: "Growing network",
    programsDelivered: "Multiple initiatives",
    communitiesReached: "Expanding coverage",
    impactMetric: "50% of profits donated to digital equity causes",
  },

  contactInfo: {
    email: "clutchdev.apps@gmail.com",
    phone: "Contact via partnership form",
    responseTime: "We respond to all partnership inquiries within 48 hours",
  },
};

export const DONATE_DATA = {
  id: "donate",
  text: {
    mainTitle: "Donate",
    subTitle: "Help support our cause with a contribution",
    description:
      "Your donation helps us continue our mission to bridge the digital divide and empower communities with the tools they need to succeed in the digital age. Every contribution directly funds digital access programs and creates pathways to STEM education opportunities.",

    impactTitle: "Your Impact",
    impactDescription:
      "When you donate to Digital Revolution, you're not just giving money - you're investing in democratic values, digital equity, and educational opportunities. Your contribution helps fund both immediate digital access needs and long-term STEM career pathways for underserved communities.",

    donationTitle: "Donation Options",
    transparencyTitle: "Transparency Commitment",
    transparencyDescription:
      "We believe in complete transparency. 50% of all proceeds (including donations) go directly to digital equity and STEM education initiatives. The remaining 50% supports operational costs, program development, and sustainable growth of our mission.",

    donationOptions: [
      {
        id: "one-time",
        title: "One-Time Donation",
        subText: "Thank you for your donation!",
        description:
          "Make a one-time donation to support our cause and help bridge the digital divide.",
        amountOptions: ["custom amount"],
        impact:
          "Every dollar makes an immediate difference in someone's digital access journey",
      },
      {
        id: "monthly",
        title: "Monthly Donation",
        subText: "You can cancel anytime.",
        description:
          "Make a monthly donation to provide sustained support for our ongoing programs and STEM education initiatives.",
        amountOptions: ["5", "10", "20", "50", "100", "200", "500", "1000"],
        impact:
          "Monthly giving allows us to plan long-term programs and provide consistent support to communities",
      },
    ],
  },

  impactBreakdown: [
    {
      amount: "$25",
      impact: "Provides digital literacy training materials for one person",
      stemConnection: "Foundation skills needed for coding and tech careers",
    },
    {
      amount: "$50",
      impact: "Funds internet access for a family for one month",
      stemConnection: "Access to online STEM courses and educational platforms",
    },
    {
      amount: "$100",
      impact: "Supports a community workshop on digital skills",
      stemConnection:
        "Group training in basic programming and computer science concepts",
    },
    {
      amount: "$250",
      impact: "Provides refurbished computer equipment to a student",
      stemConnection: "Hardware needed for STEM coursework and coding projects",
    },
    {
      amount: "$500",
      impact: "Funds a month-long coding bootcamp scholarship",
      stemConnection: "Direct pathway to technology career opportunities",
    },
  ],

  fundingAreas: [
    {
      area: "Digital Access Infrastructure",
      percentage: "30%",
      description: "Internet connectivity, hardware, and basic digital tools",
      stemImpact: "Creates foundation for accessing online STEM education",
    },
    {
      area: "Education and Training Programs",
      percentage: "40%",
      description:
        "Digital literacy, coding bootcamps, and STEM pathway programs",
      stemImpact: "Direct skill-building for technology careers",
    },
    {
      area: "Community Partnership Support",
      percentage: "20%",
      description:
        "Supporting local organizations and educational institutions",
      stemImpact: "Scaling STEM education through community networks",
    },
    {
      area: "Operations and Growth",
      percentage: "10%",
      description: "Administrative costs and sustainable program expansion",
      stemImpact: "Ensuring long-term sustainability of STEM initiatives",
    },
  ],

  otherWaysToHelp: [
    {
      title: "Shop Our Store",
      description: "Purchase our products - 50% of profits fund our mission",
      action: "Every purchase makes a difference",
    },
    {
      title: "Volunteer Your Time",
      description:
        "Help teach digital literacy or mentor aspiring STEM students",
      action: "Share your technical skills with communities in need",
    },
    {
      title: "Corporate Sponsorship",
      description: "Partner with us to sponsor programs or provide equipment",
      action: "Amplify your company's social impact",
    },
    {
      title: "Spread the Word",
      description: "Share our mission on social media and with your network",
      action: "Awareness is the first step to change",
    },
  ],

  donorRecognition: {
    title: "Recognition Levels",
    levels: [
      {
        name: "Digital Supporter",
        range: "$1 - $99",
        benefits: "Thank you email and impact updates",
      },
      {
        name: "Community Champion",
        range: "$100 - $499",
        benefits: "Quarterly impact reports and recognition on website",
      },
      {
        name: "STEM Advocate",
        range: "$500 - $999",
        benefits: "Annual report, website recognition, and program updates",
      },
      {
        name: "Digital Revolution Partner",
        range: "$1000+",
        benefits:
          "Direct communication with founder, program insights, and partnership opportunities",
      },
    ],
  },

  contributionInfo: {
    title: "Contributions to Our Mission",
    description:
      "Digital Revolution is not yet a registered nonprofit organization. While your generous contributions may not currently qualify as tax-deductible donations, they directly fund our mission to bridge the digital divide and create STEM education opportunities. You will receive a receipt acknowledging your contribution via email.",
    status: "Working toward 501(c)(3) nonprofit status to maximize your impact",
  },
};

export const PROFILE_DATA = {
  id: "profile",
  text: {
    mainTitle: "Profile",
    subTitle: "Manage your profile",
  },
  cancelSubscription: {
    title: "Cancel Subscription",
    pleaseProvideReason: "Please provide a reason for your cancellation",
  },
};

export const SHARE_DATA = {
  id: "share",
  text: {
    mainTitle: "Share",
    subTitle: "Share our mission with others",
    description:
      "Help us spread awareness about digital equity and STEM opportunities by sharing our mission with your network. Every share helps us reach more communities that need digital access and educational pathways.",
    promotion: "Tag us in your posts and we'll feature you on our website!",
    whyShareTitle: "Why Share Our Mission?",
    whyShareDescription:
      "When you share Digital Revolution's mission, you're helping us reach underserved communities who may not know about available digital resources and STEM education opportunities. Your voice helps amplify our impact.",
    hashtagsTitle: "Use Our Hashtags",
    sharingTipsTitle: "Sharing Tips",
  },

  hashtags: [
    "#DigitalRevolution",
    "#DigitalEquity",
    "#STEMForAll",
    "#BridgeTheGap",
    "#TechForGood",
    "#DigitalInclusion",
    "#STEMEducation",
    "#CommunityTech",
    "#CodeForChange",
    "#DigitalDemocracy",
  ],

  sharingReasons: [
    {
      icon: "🌐",
      title: "Bridge the Digital Divide",
      description:
        "Help communities gain access to internet connectivity and digital tools necessary for modern life and education",
    },
    {
      icon: "💻",
      title: "Create STEM Pathways",
      description:
        "Connect individuals to coding bootcamps, engineering courses, and technology career opportunities",
    },
    {
      icon: "🎓",
      title: "Support Education",
      description:
        "Enable access to online learning platforms, research databases, and educational resources",
    },
    {
      icon: "🤝",
      title: "Strengthen Democracy",
      description:
        "Ensure all communities can participate fully in digital civic life and democratic processes",
    },
  ],

  shareableContent: [
    {
      type: "Mission Statement",
      content:
        "Democracy and egalitarian values cannot be achieved and maintained if countries or communities are mere spectators and renters of the digital world. Join @DigitalRevolution in bridging the gap!",
      hashtags: ["#DigitalRevolution", "#DigitalEquity", "#STEMForAll"],
    },
    {
      type: "Impact Focus",
      content:
        "50% of Digital Revolution's profits go directly to digital equity initiatives and STEM education programs. Shopping with purpose makes a difference!",
      hashtags: ["#TechForGood", "#STEMEducation", "#DigitalInclusion"],
    },
    {
      type: "Call to Action",
      content:
        "Digital access shouldn't be a privilege. Help us create pathways from digital exclusion to technology careers. Every community deserves digital equity.",
      hashtags: ["#BridgeTheGap", "#CodeForChange", "#CommunityTech"],
    },
  ],

  sharingTips: [
    {
      tip: "Personal Connection",
      description:
        "Share why digital equity matters to you personally or in your community",
    },
    {
      tip: "Tag Friends",
      description:
        "Tag friends who work in tech, education, or community development",
    },
    {
      tip: "Add Your Story",
      description:
        "Share how digital access has impacted your education or career journey",
    },
    {
      tip: "Use Visuals",
      description:
        "Share photos of our products or screenshots of our mission content",
    },
    {
      tip: "Engage Regularly",
      description:
        "Regular posts about digital equity help keep the conversation going",
    },
  ],

  promotionLinks: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61569189908839",
      handle: "Digital Revolution",
      platform: "facebook",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/ramon.mnm",
      handle: "Digital Revolution",
      platform: "instagram",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ramonmnm100",
      handle: "Digital Revolution",
      platform: "linkedin",
    },
    {
      label: "TikTok",
      href: "https://www.tiktok.com/@ramonm_m?lang=en",
      handle: "Digital Revolution",
      platform: "tiktok",
    },
  ],

  featuredContent: {
    title: "Get Featured",
    description:
      "Share content about our mission and tag us for a chance to be featured on our website and social media channels",
    requirements: [
      "Tag Digital Revolution in your post",
      "Use relevant hashtags from our list",
      "Share authentic content about digital equity or STEM education",
      "Follow our social media accounts",
    ],
    benefits: [
      "Featured on our website's community section",
      "Shared on our social media channels",
      "Recognition as a digital equity advocate",
      "Connect with like-minded community members",
    ],
  },

  communityGoals: [
    {
      goal: "Reach 1,000 digital equity advocates",
      description:
        "Building a community of people passionate about closing the digital divide",
    },
    {
      goal: "Connect 500 individuals to STEM opportunities",
      description:
        "Helping people discover coding bootcamps, tech careers, and educational pathways",
    },
    {
      goal: "Support 100 communities",
      description:
        "Providing digital resources and technology access to underserved areas",
    },
    {
      goal: "Fund 50 scholarships",
      description:
        "Sponsoring coding bootcamps and technology education programs",
    },
  ],

  impactStats: {
    title: "Sharing Creates Impact",
    stats: [
      {
        metric: "50%",
        description: "Of profits donated to digital equity causes",
      },
      {
        metric: "Growing",
        description: "Communities reached through our programs",
      },
      {
        metric: "100%",
        description: "Transparency in how we use contributions",
      },
      {
        metric: "2025",
        description: "Year we started bridging the digital divide",
      },
    ],
  },
};
